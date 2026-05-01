// api/lead.js
const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método não permitido' });
    }

    const { nome, email, empresa } = req.body;

    if (!nome || !email) {
        return res.status(400).json({ message: 'Campos obrigatórios faltando.' });
    }

    try {
        // Configuração para o SMTP do Gmail
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // Usa SSL
            auth: {
                user: 'riskgri@gmail.com', 
                // A senha real deve ficar oculta nas variáveis da Vercel!
                pass: process.env.GMAIL_APP_PASSWORD 
            }
        });

        // Montagem do E-mail
        const mailOptions = {
            from: '"GRI Landing Page" <riskgri@gmail.com>', // Quem envia
            to: 'riskgri@gmail.com', // Quem recebe (pode adicionar mais emails separados por vírgula)
            subject: `🔥 Novo Lead Capturado: ${empresa || nome}`,
            text: `Novo lead gerado.\nNome: ${nome}\nE-mail: ${email}\nEmpresa: ${empresa || 'Não informada'}`,
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #00d2ff; border-bottom: 2px solid #00d2ff; padding-bottom: 10px;">Novo Lead - GRI</h2>
                    <p><strong>Nome:</strong> ${nome}</p>
                    <p><strong>E-mail:</strong> ${email}</p>
                    <p><strong>Empresa:</strong> ${empresa || 'Não informada'}</p>
                    <br>
                    <p style="font-size: 12px; color: #888;">E-mail gerado automaticamente pelo sistema de captação.</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("E-mail disparado via Gmail. ID:", info.messageId);

        return res.status(200).json({ success: true, message: 'Lead enviado!' });

    } catch (error) {
        console.error("Erro no envio do e-mail:", error);
        return res.status(500).json({ success: false, message: 'Falha interna no servidor.' });
    }
}