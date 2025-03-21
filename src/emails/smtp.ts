import nodemailer from 'nodemailer'
import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'

config()

interface EmailParams {
  to: string
  subject: string
  templateName: string
  replacements: { [key: string]: string }
}

const getTemplate = (templateName: string, replacements: { [key: string]: string }): string => {
  const filePath = path.join(__dirname, 'templates', `${templateName}.html`)
  let template = fs.readFileSync(filePath, 'utf8')

  for (const key in replacements) {
    template = template.replace(new RegExp(`{${key}}`, 'g'), replacements[key])
  }

  return template
}

export const sendEmail = async ({ to, subject, templateName, replacements }: EmailParams): Promise<void> => {
  const htmlContent = getTemplate(templateName, replacements)

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: htmlContent
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log(`✅ Email sent to ${to}`)
  } catch (error) {
    console.error('❌ Error sending email:', error)
  }
}
