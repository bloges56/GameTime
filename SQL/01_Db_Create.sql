USE [master]

IF db_id('GameTime') IS NULL
  CREATE DATABASE [GameTime]
GO

USE [GameTime]
GO


DROP TABLE IF EXISTS [Friend];
DROP TABLE IF EXISTS [UserSession];
DROP TABLE IF EXISTS [Session];
DROP TABLE IF EXISTS [User];
GO


CREATE TABLE [User] (
  [Id] integer PRIMARY KEY IDENTITY,
  [FirebaseUserId] NVARCHAR(28) NOT NULL,
  [UserName] nvarchar(20) NOT NULL,
  [Email] nvarchar(555) NOT NULL,
  [Bio] nvarchar(1000) NOT NULL,
  [ImageUrl] nvarchar(255),
  [IsActive] bit NOT NULL DEFAULT 1,

  CONSTRAINT UQ_FirebaseUserId UNIQUE(FirebaseUserId),
  CONSTRAINT UQ_Email UNIQUE(Email),
  CONSTRAINT UQ_UserName UNIQUE(UserName)
)

CREATE TABLE [Session] (
	[Id] integer PRIMARY KEY IDENTITY,
	[Title] nvarchar(50) NOT NULL,
	[Time] datetime NOT NULL,
	[Game] nvarchar(50) NOT NULL,
	[OwnerId] integer NOT NULL,

	CONSTRAINT [FK_Session_Owner] FOREIGN KEY ([OwnerId]) REFERENCES [User] ([Id])
)

CREATE TABLE [UserSession] (
	[Id] integer PRIMARY KEY IDENTITY,
	[SessionId] integer NOT NULL,
	[UserId] integer NOT NULL,
	[IsConfirmed] bit NOT NULL DEFAULT 0,

	CONSTRAINT [FK_UserSession_User] FOREIGN KEY ([UserId]) REFERENCES [User] ([Id]),
	CONSTRAINT [FK_UserSession_Session] FOREIGN KEY ([SessionId]) REFERENCES [Session] ([Id])
)

CREATE TABLE [Friend] (
	[Id] integer PRIMARY KEY IDENTITY,
	[UserId] integer NOT NULL,
	[OtherId] integer NOT NULL,
	[IsConfirmed] bit NOT NULL DEFAULT 0,

	CONSTRAINT [FK_Friend_User] FOREIGN KEY ([UserId]) REFERENCES [User] ([Id]),
	CONSTRAINT [FK_Friend_Other] FOREIGN KEY ([OtherId]) REFERENCES [User] ([Id])
)
GO

set identity_insert [User] on
insert into [User] ([Id], [FirebaseUserId], [UserName], [Email], [Bio], [ImageUrl], [IsActive])
values (1,'placeholder1', 'goldenGod', 'dennis@menace.com', 'Its about the implication', 'https://icon-library.com/images/default-user-icon/default-user-icon-8.jpg', 1), 
	(2, 'placeholder2', 'ratKing', 'bar@janitor.com', 'Oooh cat in the walls', 'https://icon-library.com/images/default-user-icon/default-user-icon-8.jpg', 1),
	(3, 'placeholder3', 'BigMac', 'ocular@patdown.com', 'Im building mass', 'https://icon-library.com/images/default-user-icon/default-user-icon-8.jpg', 0),
	(4, 'placeholder4', 'sweetDee', 'failed@actress.com', 'That stupid bitch', 'https://icon-library.com/images/default-user-icon/default-user-icon-8.jpg', 1),
	(5, 'placeholder5', 'mantisTobagan', 'filth@lover.com', 'Accidentally dropped my magnum condum for my massive dong', 'https://icon-library.com/images/default-user-icon/default-user-icon-8.jpg', 1)
set identity_insert [User] off

set identity_insert [Session] on
insert into [Session] ([Id], [Title], [Time], [Game], [OwnerId])
values (1, 'Electric Boogaloo', '20210213 08:30:00 PM', 'CharDeeMacDennis', 1),
	(2, 'ThunderGun Express', '20200129 09:00:00 PM', 'Monsters vs Aliens', 5)
set identity_insert [Session] off

set identity_insert [Friend] on
insert into [Friend] ([Id], [UserId], [OtherId], [IsConfirmed])
values (1, 1, 4, 1), (2, 4, 1, 1), (3, 2, 1, 0), (4, 1, 5, 1), (5, 5, 1, 1), (6, 5, 2, 1), (7, 2, 5, 1), (8, 1, 3, 1), (9, 3, 1, 1)
set identity_insert [Friend] off

set identity_insert [UserSession] on
insert into [UserSession] ([Id], [SessionId], [UserId], [IsConfirmed])
values (1, 1, 1, 1), (2, 1, 4, 0), (3, 1, 5, 1), (4, 2, 5, 1), (5, 2, 2, 1)
set identity_insert [UserSession] off
