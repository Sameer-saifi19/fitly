import { NextResponse } from "next/server";
import type { NextRequest } from "next/server"
import jwt from 'jsonwebtoken';

export function middleware(request: NextRequest){
    const token = request.cookies.get("token")?.value

    if(!token){
        return NextResponse.redirect(new URL("/signin", request.url));
    }

    try { 
        jwt.verify(token, process.env.JWT_SECRET!);
        return NextResponse.next();
        
    } catch (error) {
        return NextResponse.redirect(new URL("/signin", request.url));
    }
}

export const config = {
    matcher: ["/dashboard", "/profile"]
}