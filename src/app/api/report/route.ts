import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { email, subject, message } = await req.json();

  if (!email || !subject || !message) {
    return NextResponse.json({ error: 'Please fill all fields' }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mohmum555@gmail.com',
      pass: 'qvgp baeq pmml rwud'
    }
  });

  const mailOptions = {
    from: 'mohmum555@gmail.com',
    to: 'support@flipfile.com',
    subject: `[FlipFile] ${subject}`,
    text: `Email: ${email}\n\n${message}`
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true, message: 'Report sent successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ success: false, error: 'Failed to send report.' }, { status: 500 });
  }
}
