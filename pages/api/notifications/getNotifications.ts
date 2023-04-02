/* requests gives user email address and response gives an array of their notifications */
import type { NextApiRequest, NextApiResponse } from "next";
import { INotification } from "types/Notification.d";
import { sendErrorResponse, sendSuccessResponse } from "../responses";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const username = req.body.username; //email address of user
    //get notifications that belong to user

    const notifications: INotification[] = [
      {
        id: 0,
        user: {
          userId: "test",
          name: "Test Person",
          profileImage: "",
          role: "admin",
        },
        title: "New Document",
        route: "/documents",
        date: new Date(),
      },
    ];

    sendSuccessResponse(res, notifications);
  } catch (error) {
    console.error(error);
    sendErrorResponse(res, error);
  }
};
