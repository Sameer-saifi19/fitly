import { prisma } from "@/lib/prisma";
import { signupSchema } from "@/lib/validation/user";
import { hash } from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        
        const body = await req.json();

        const parsedData = signupSchema.parse(body);
        const {name, email, password} = parsedData;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return NextResponse.json(
                { message: "user already Exist"},
                { status: 400 }
            );
        };
        
        const hashedPassword = await hash(password, 12);
        
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });

        console.log('user created', user.name)

        return NextResponse.json(
            {
                message: "User Created Successfully",
            },
            {
                status:201
            }
        );
    }catch(error){
        console.error("Signup Error", error)
        return NextResponse.json({
            message:"Something went wrong"
        },
    {
        status:500
    })
    }

    
}