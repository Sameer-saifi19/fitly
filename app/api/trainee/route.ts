import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const getTrainee = await prisma.trainee.findMany({
      where: {
        role: "MEMBER",
      },
    });

    return NextResponse.json(getTrainee);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to load trainee list" },
      { status: 500 }
    );
  }
}


export async function POST(request:NextRequest) {
  try{
    const data = await request.json();
    const createTrainee = await prisma.trainee.create({
      data,
    });

    return NextResponse.json(createTrainee, {status:201})
  }catch(error){
    return NextResponse.json({
      message: "error creating trainee"
    },{status:500})
  }
}