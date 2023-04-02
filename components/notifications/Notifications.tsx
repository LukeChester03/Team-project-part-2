import Popover from "../misc/Popover";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Badge, Card, CardContent, Typography, Button } from "@mui/material";
import { useNotifications } from "hooks/useNotifications";
import { INotification } from "types/Notification.d";
import LoadingPage from "components/misc/LoadingPage";
import React from "react";
import { useRouter } from "next/router";

export default function Notifications() {
  // Use the `useNotifications` hook to get notifications data from the database
  const { loading, notifications } = useNotifications(); // Destructuring the results of the useNotifications hook

  // State to keep track of read notifications
  const [readNotifications, setReadNotifications] = React.useState<number[]>(
    []
  ); // Defining state using the useState hook

  // Function to handle marking a single notification as read
  const handleReadNotification = (id: number) => {
    setReadNotifications([...readNotifications, id]); // Adding the given notification ID to the readNotifications array
  };

  // Function to handle marking all notifications as read
  const handleReadAllNotifications = () => {
    setReadNotifications(
      notifications?.map((notification) => notification.id) || []
    );
  }; // Adding all notification IDs to the readNotifications array

  // Filter notifications to only show unread notifications
  const filteredNotifications = notifications?.filter(
    (notification) => !readNotifications.includes(notification.id)
  ); // Filtering out notifications whose ID is in the readNotifications array

  // Getting the router object from the useRouter hook
  const router = useRouter();

  // Render the notifications page
  const notificationsPage = (
    <div style={{ height: "500px", overflow: "auto" }}>
      <div className="flex flex-col gap-4 p-4">
        {filteredNotifications && filteredNotifications.length > 1 && (
          <Button
            variant="contained"
            style={{ color: "white", background: "yellow" }}
            onClick={handleReadAllNotifications}
          >
            Mark all as read
          </Button>
        )}
        {filteredNotifications?.map((notification) => (
          <Card
            key={notification.id}
            className="w-80 md:w-96 lg:w-108 xl:w-120"
          >
            <CardContent>
              <Typography variant="h6" className="font-bold">
                {notification.title}
              </Typography>
              <Typography>
                {new Date(notification.date).toLocaleString()}
              </Typography>
              <div className="flex justify-between">
                <Button
                  variant="contained"
                  style={{
                    color: "white",
                    background: "yellow",
                    padding: "6px 12px",
                    minWidth: "unset",
                  }}
                  onClick={() => handleReadNotification(notification.id)}
                >
                  Marked as read
                </Button>
                <Button
                  variant="contained"
                  style={{
                    color: "white",
                    background: "yellow",
                    padding: "6px 12px",
                    minWidth: "unset",
                  }}
                  onClick={() => router.push(notification.route as string)}
                >
                  Go to
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  //loading page to be shown whilst data is being fetched
  const loadingContent = <LoadingPage />;

  //button that opens notifications page when clicked
  const notificationsButton = (
    <Badge
      badgeContent={filteredNotifications && filteredNotifications.length}
      color="warning"
      max={99}
    >
      <NotificationsIcon />
    </Badge>
  );

  // Renders the notification popup as a popover and shows the notificationsButton
  return (
    //The notifcationButton won't show if there is no notifcation
    <>
      {filteredNotifications && filteredNotifications.length > 0 && (
        <Popover button={notificationsButton}>
          {loading ? loadingContent : notificationsPage}
        </Popover>
      )}
      {(!filteredNotifications || filteredNotifications.length === 0) &&
        notificationsButton}
    </>
  );
}
