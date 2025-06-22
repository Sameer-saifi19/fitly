import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        const { email, password} = await req.json();
        
        const user = await prisma.user.findUnique({ where :{ email }});

        if(!user){
            return NextResponse.json({
                message: "User not found"
            },{status: 404})
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

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
                id: user.id,
            }, jwtSecret)

        return NextResponse.json({
            token: token,
            message: "sign in success"
        })
        }
    } catch (error) {
        console.error("something went wrong", error);
        return NextResponse.json({
            message: "Something went wrong"
        })
    }
}