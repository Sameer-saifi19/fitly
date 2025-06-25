import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        const { email, password} = await req.json();
        
        const admin = await prisma.admin.findUnique({ where :{ email }});

        if(!admin){
            return NextResponse.json({
                message: "Account not found"
            },{status: 404})
        }

        const isPasswordCorrect = await bcrypt.compare(password, admin.password);

        if(!isPasswordCorrect){
            return NextResponse.json({
                message:"Incorrect Email or Password"
            },{status:401})
        }else{
            const jwtSecret = process.env.JWT_SECRET;
            if (!jwtSecret) {
                throw new Error("JWT secret is not defined in environment variables.");
            }
            const token = jwt.sign({
                id: admin.id,
            }, jwtSecret)

            const response = NextResponse.json({
                message: "Signin successful",
                token: token
            })

            response.cookies.set("token success", token,{
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                path:"/",
                maxAge: 60 * 60 * 24 *7
            })
            console.log("token:  ",token)
            return response;

        }
    } catch (error) {
        console.error("something went wrong", error);
        return NextResponse.json({
            message: "Something went wrong"
        })
    }
}