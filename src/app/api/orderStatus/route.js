import { NextResponse } from "next/server";
import dbConnection from "../../../lib/Connection";
import Order from "../../../models/Order";

export async function PUT(req) {
  await dbConnection();
  try {
    const { orderId, status , adminNotes } = await req.json();

    if (!orderId || !status) {
      return NextResponse.json({
        message: "Order ID and status are required",
        status: 400,
        success: false,
      });
    }

    const validStatuses = ["pending", "approved", "rejected"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({
        message: "Invalid status. Valid statuses are: " + validStatuses.join(", "),
        status: 400,
        success: false,
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({
        message: "Order not found",
        status: 404,
        success: false,
      });
    }

    if (status === "approved" && order.status === "pending") {
      order.status = status;
      order.adminNotes = adminNotes;
      await order.save();
      return NextResponse.json({
        message: "Order status updated to approved",
        status: 200,
        success: true,
        data: order,
      });
    } else if (status === "rejected" && order.status === "pending") {
      order.status = "rejected";
      order.adminNotes = adminNotes;
      order.save();
      return NextResponse.json({
        message: "Order rejected and deleted",
        status: 200,
        success: true,
      });
    } else if (status === "rejected" && order.status === "approved") {
      return NextResponse.json({
        message: "Cannot reject an already approved order",
        status: 400,
        success: false,
      });
    }

    return NextResponse.json({
      message: "No changes made to order status",
      status: 200,
      success: true,
      data: order,
    });

  } catch (error) {
    return NextResponse.json({
      message: "Error updating order status: " + error.message,
      status: 500,
      success: false,
    });
  }
}
