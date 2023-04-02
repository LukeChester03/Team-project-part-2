-- CreateTable
CREATE TABLE `Documents` (
    `Document_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Author` VARCHAR(50) NULL,
    `Body` VARCHAR(5000) NULL,
    `Title` VARCHAR(50) NULL,
    `Topic` VARCHAR(50) NULL,
    `Category` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Document_ID`(`Document_ID`),
    PRIMARY KEY (`Document_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Projects` (
    `Project_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Leader_Email` VARCHAR(50) NULL,
    `Task_ID` INTEGER NULL,
    `Project_Name` VARCHAR(30) NULL,
    `Deadline` DATETIME(0) NULL,

    PRIMARY KEY (`Project_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Topics` (
    `Topic_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Topic_Name` VARCHAR(50) NULL,

    PRIMARY KEY (`Topic_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Users` (
    `User_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(40) NOT NULL,
    `Email` VARCHAR(50) NOT NULL,
    `Password` VARCHAR(60) NOT NULL,
    `Is_Manager` BOOLEAN NOT NULL,
    `Is_Admin` BOOLEAN NOT NULL,

    UNIQUE INDEX `Email`(`Email`),
    PRIMARY KEY (`User_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notifications` (
    `Notification_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Email` VARCHAR(50) NULL,
    `Title` VARCHAR(30) NULL,
    `Description` VARCHAR(250) NULL,
    `Date` DATETIME(0) NULL,
    `Seen` BOOLEAN NULL,

    PRIMARY KEY (`Notification_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tasks` (
    `Task_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Email` VARCHAR(50) NULL,
    `Task_Name` VARCHAR(40) NULL,
    `Task_Desc` VARCHAR(500) NULL,
    `Man_Hours` INTEGER NULL,
    `Deadline` DATETIME(0) NULL,
    `Status` INTEGER NULL,
    `Archived` BOOLEAN NULL,

    UNIQUE INDEX `Task_ID`(`Task_ID`),
    PRIMARY KEY (`Task_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
