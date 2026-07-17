import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, name, amount, description, cpf } = body

    const secretKey = process.env.VELANA_SECRET_KEY
    console.log('Iniciando integração de Pix Velana para:', email, 'Valor:', amount)

    try {
      const basicAuth = Buffer.from(`${secretKey}:x`).toString('base64')
      const cleanCpf = cpf ? cpf.replace(/\D/g, '') : '00000000000'
      const docType = cleanCpf.length === 14 ? 'cnpj' : 'cpf'

      const response = await fetch('https://api.velana.com.br/v1/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${basicAuth}`
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // value in cents
          paymentMethod: 'pix',
          customer: {
            name: name || 'Cliente MK Tips',
            email: email || 'cliente@mktips.com',
            document: {
              number: cleanCpf,
              type: docType
            }
          },
          items: [
            {
              title: description || 'Pagamento Pix MK Tips',
              unitPrice: Math.round(amount * 100),
              quantity: 1,
              tangible: false
            }
          ],
          pix: {
            expiresIn: 3600
          }
        }),
        signal: AbortSignal.timeout(5000) // 5s timeout
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Resposta sucesso Velana:', data)
        
        // Match standard Velana fields in response: data.pix?.qrcode
        const qrCodeVal = data.pix?.qrcode || data.pix?.qrCode || data.pix?.copiaCola || data.pix?.qr_code || data.qrCode || data.copiaCola
        const txIdVal = data.id || data.transactionId || `velana_${Date.now()}`
        
        if (qrCodeVal) {
          return NextResponse.json({
            success: true,
            provider: 'velana',
            qrCode: qrCodeVal,
            transactionId: txIdVal
          })
        } else {
          console.warn('Velana respondeu com sucesso mas sem qrcode Pix:', data)
          return NextResponse.json({
            success: false,
            error: 'QR Code Pix não encontrado na resposta do gateway'
          }, { status: 400 })
        }
      } else {
        const errorText = await response.text()
        console.warn('Erro retornado pela Velana API:', errorText)
        try {
          const errObj = JSON.parse(errorText)
          return NextResponse.json({
            success: false,
            error: errObj.message || 'Erro retornado pela Velana API'
          }, { status: response.status })
        } catch {
          return NextResponse.json({
            success: false,
            error: `Erro Velana API (${response.status}): ${errorText}`
          }, { status: response.status })
        }
      }
    } catch (apiError: any) {
      console.error('Falha de conexão com a Velana API:', apiError)
      return NextResponse.json({
        success: false,
        error: `Falha de conexão com o gateway de pagamento: ${apiError.message || apiError}`
      }, { status: 502 })
    }
  } catch (err: any) {
    console.error('Erro na rota de Pix Velana:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID da transação não fornecido' }, { status: 400 })
    }

    const secretKey = process.env.VELANA_SECRET_KEY
    const basicAuth = Buffer.from(`${secretKey}:x`).toString('base64')

    const response = await fetch(`https://api.velana.com.br/v1/transactions/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${basicAuth}`
      }
    })

    if (response.ok) {
      const data = await response.json()
      return NextResponse.json({
        success: true,
        status: data.status,
        paid: data.status === 'paid'
      })
    } else {
      const errorText = await response.text()
      return NextResponse.json({
        success: false,
        error: `Erro ao buscar status: ${errorText}`
      }, { status: response.status })
    }
  } catch (err: any) {
    console.error('Erro ao verificar pagamento Velana:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
