import {NextRequest, NextResponse} from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const {subject, message} = await req.json();

    if (!subject || !message) {
      return NextResponse.json(
        {error: 'Please fill all fields'},
        {status: 400}
      );
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'mohmum555@gmail.com',
        pass: 'qvgp baeq pmml rwud',
      },
    });

    const mailOptions = {
      from: 'mohmum555@gmail.com',
      to: 'support@flipfile.com',
      subject: `[FlipFile Report] ${subject}`,
      text: `Subject: ${subject}\n\nMessage:\n${message}`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      {success: true, message: 'Report sent successfully!'},
      {status: 200}
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      {success: false, error: 'Failed to send report.'},
      {status: 500}
    );
  }
}
