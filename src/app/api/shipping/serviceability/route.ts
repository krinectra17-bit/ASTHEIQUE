import { NextRequest, NextResponse } from 'next/server';
import { checkPincodeServiceability } from '@/lib/shiprocket/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pincode = searchParams.get('pincode');
    const pickup = searchParams.get('pickup') || '110020';

    if (!pincode || !/^[1-9][0-9]{5}$/.test(pincode.trim())) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please provide a valid 6-digit Indian postal PIN code.',
        },
        { status: 400 }
      );
    }

    const result = await checkPincodeServiceability(pincode.trim(), pickup);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error checking postal code serviceability',
      },
      { status: 500 }
    );
  }
}
