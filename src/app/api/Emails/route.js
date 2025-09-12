import { NextResponse } from "next/server";
import dbConnection from "@/lib/Connection";
import User from "@/models/User";
import { Resend } from "resend";
import AllUsersEmail from "../../../components/Emails";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    await dbConnection();

    const body = await req.json();
    const { subject, message } = body;

    if (!subject || !message) {
      return NextResponse.json(
        { error: "Subject and message are required." },
        { status: 400 }
      );
    }

    const users = await User.find({}, "email");
    const recipientEmails = users.map((u) => u.email);

    if (recipientEmails.length === 0) {
      return NextResponse.json({ error: "No users found" }, { status: 404 });
    }

    await resend.emails.send({
      from: "Admin <on@yourdomain.com>",
      to: recipientEmails,
      subject,
      react: <AllUsersEmail message={message} />, // ✅ Correct way
    });

    return NextResponse.json(
      { message: "Email sent to all users successfully!" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error sending email:", err);
    return NextResponse.json(
      { error: "Failed to send email", details: err.message },
      { status: 500 }
    );
  }
}
