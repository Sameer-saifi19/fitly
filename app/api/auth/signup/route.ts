import { prisma } from "@/lib/prisma";
import { signupSchema } from "@/lib/validation/signupSchema";
import { hash } from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsedData = signupSchema.parse(body);
    const { name, email, password } = parsedData;

    const existingUser = await prisma.admin.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Account already Exist" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 12);

    const admin = await prisma.admin.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });


    return NextResponse.json(
      {
        message: "Account Created Successfully",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Signup Error", error);
    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}
