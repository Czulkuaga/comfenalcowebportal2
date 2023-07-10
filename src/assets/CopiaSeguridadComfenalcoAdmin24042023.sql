/*

 Source Server         : SQL Server Cluster Aliatic
 Source Server Type    : SQL Server
 Source Server Version : 15004261 (15.00.4261)
 Source Host           : 192.168.1.18:1433
 Source Catalog        : ComfenalcoAdmin
 Source Schema         : dbo

 Target Server Type    : SQL Server
 Target Server Version : 15004261 (15.00.4261)
 File Encoding         : 65001

 Date: 24/04/2023 08:22:31
*/


-- ----------------------------
-- Table structure for genero
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[genero]') AND type IN ('U'))
	DROP TABLE [dbo].[genero]
GO

CREATE TABLE [dbo].[genero] (
  [id] int  IDENTITY(1,1) NOT NULL,
  [code] varchar(1) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL,
  [description] varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL
)
GO

ALTER TABLE [dbo].[genero] SET (LOCK_ESCALATION = TABLE)
GO


-- ----------------------------
-- Records of genero
-- ----------------------------
SET IDENTITY_INSERT [dbo].[genero] ON
GO

INSERT INTO [dbo].[genero] ([id], [code], [description]) VALUES (N'1', N'0', N'Sexo Desconocido')
GO

INSERT INTO [dbo].[genero] ([id], [code], [description]) VALUES (N'2', N'1', N'Hombre')
GO

INSERT INTO [dbo].[genero] ([id], [code], [description]) VALUES (N'3', N'2', N'Mujer')
GO

INSERT INTO [dbo].[genero] ([id], [code], [description]) VALUES (N'4', N'3', N'No Binario')
GO

INSERT INTO [dbo].[genero] ([id], [code], [description]) VALUES (N'5', N'9', N'Genero no especificado')
GO

SET IDENTITY_INSERT [dbo].[genero] OFF
GO


-- ----------------------------
-- Table structure for tipo_cliente
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[tipo_cliente]') AND type IN ('U'))
	DROP TABLE [dbo].[tipo_cliente]
GO

CREATE TABLE [dbo].[tipo_cliente] (
  [id] int  IDENTITY(1,1) NOT NULL,
  [code] varchar(30) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL,
  [description] varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL
)
GO

ALTER TABLE [dbo].[tipo_cliente] SET (LOCK_ESCALATION = TABLE)
GO


-- ----------------------------
-- Records of tipo_cliente
-- ----------------------------
SET IDENTITY_INSERT [dbo].[tipo_cliente] ON
GO

INSERT INTO [dbo].[tipo_cliente] ([id], [code], [description]) VALUES (N'1', N'E', N'Empresarial')
GO

INSERT INTO [dbo].[tipo_cliente] ([id], [code], [description]) VALUES (N'2', N'I', N'Individual')
GO

INSERT INTO [dbo].[tipo_cliente] ([id], [code], [description]) VALUES (N'4', N'S', N'Sucursal')
GO

SET IDENTITY_INSERT [dbo].[tipo_cliente] OFF
GO


-- ----------------------------
-- Table structure for tipo_identificacion
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[tipo_identificacion]') AND type IN ('U'))
	DROP TABLE [dbo].[tipo_identificacion]
GO

CREATE TABLE [dbo].[tipo_identificacion] (
  [id] int  IDENTITY(1,1) NOT NULL,
  [ididen] varchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL,
  [identificador] varchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL,
  [nombre] varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL,
  [pais] varchar(2) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL
)
GO

ALTER TABLE [dbo].[tipo_identificacion] SET (LOCK_ESCALATION = TABLE)
GO


-- ----------------------------
-- Records of tipo_identificacion
-- ----------------------------
SET IDENTITY_INSERT [dbo].[tipo_identificacion] ON
GO

INSERT INTO [dbo].[tipo_identificacion] ([id], [ididen], [identificador], [nombre], [pais]) VALUES (N'1', N'1', N'NIT', N'31-Número de identificación tributaria', N'CO')
GO

INSERT INTO [dbo].[tipo_identificacion] ([id], [ididen], [identificador], [nombre], [pais]) VALUES (N'2', N'2', N'CC', N'13-Cédula de ciudadanía', N'CO')
GO

INSERT INTO [dbo].[tipo_identificacion] ([id], [ididen], [identificador], [nombre], [pais]) VALUES (N'3', N'3', N'PA', N'41-Pasaporte', N'CO')
GO

INSERT INTO [dbo].[tipo_identificacion] ([id], [ididen], [identificador], [nombre], [pais]) VALUES (N'4', N'4', N'RC', N'11-Registro Civil de Nacimiento', N'CO')
GO

INSERT INTO [dbo].[tipo_identificacion] ([id], [ididen], [identificador], [nombre], [pais]) VALUES (N'5', N'5', N'TI', N'12-Tarjeta de identidad', N'CO')
GO

INSERT INTO [dbo].[tipo_identificacion] ([id], [ididen], [identificador], [nombre], [pais]) VALUES (N'6', N'8', N'CE', N'21-Tarjeta de extranjero', N'CO')
GO

INSERT INTO [dbo].[tipo_identificacion] ([id], [ididen], [identificador], [nombre], [pais]) VALUES (N'7', N'Z1', N'PE', N'16-Permiso especial venezolanos', N'CO')
GO

INSERT INTO [dbo].[tipo_identificacion] ([id], [ididen], [identificador], [nombre], [pais]) VALUES (N'8', N'Z2', N'SE', N'23-ID Secretaria de educacion', N'CO')
GO

INSERT INTO [dbo].[tipo_identificacion] ([id], [ididen], [identificador], [nombre], [pais]) VALUES (N'9', N'Z3', N'VI', N'15-Visa', N'CO')
GO

INSERT INTO [dbo].[tipo_identificacion] ([id], [ididen], [identificador], [nombre], [pais]) VALUES (N'10', N'Z4', N'PT', N'PT-Permiso Por Protección Temporal', N'CO')
GO

INSERT INTO [dbo].[tipo_identificacion] ([id], [ididen], [identificador], [nombre], [pais]) VALUES (N'11', N'Z5', N'DE', N'42-Número de identificación extranjería', N'CO')
GO

INSERT INTO [dbo].[tipo_identificacion] ([id], [ididen], [identificador], [nombre], [pais]) VALUES (N'12', N'Z6', N'SI', N'43-Sin Identificación tributaría', N'CO')
GO

INSERT INTO [dbo].[tipo_identificacion] ([id], [ididen], [identificador], [nombre], [pais]) VALUES (N'13', N'Z7', N'CD', N'46-Carné Diplomático', N'CO')
GO

INSERT INTO [dbo].[tipo_identificacion] ([id], [ididen], [identificador], [nombre], [pais]) VALUES (N'14', N'Z8', N'PEP', N'47-PEP Permiso Especial Venezolan', N'CO')
GO

INSERT INTO [dbo].[tipo_identificacion] ([id], [ididen], [identificador], [nombre], [pais]) VALUES (N'15', N'Z9', N'NOP', N'50-Nit de Otro País', N'CO')
GO

SET IDENTITY_INSERT [dbo].[tipo_identificacion] OFF
GO


-- ----------------------------
-- Table structure for tipo_sector
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[tipo_sector]') AND type IN ('U'))
	DROP TABLE [dbo].[tipo_sector]
GO

CREATE TABLE [dbo].[tipo_sector] (
  [id] int  IDENTITY(1,1) NOT NULL,
  [code] varchar(30) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL,
  [description] varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL
)
GO

ALTER TABLE [dbo].[tipo_sector] SET (LOCK_ESCALATION = TABLE)
GO


-- ----------------------------
-- Records of tipo_sector
-- ----------------------------
SET IDENTITY_INSERT [dbo].[tipo_sector] ON
GO

INSERT INTO [dbo].[tipo_sector] ([id], [code], [description]) VALUES (N'1', N'M', N'Mixto')
GO

INSERT INTO [dbo].[tipo_sector] ([id], [code], [description]) VALUES (N'2', N'N', N'Natural')
GO

INSERT INTO [dbo].[tipo_sector] ([id], [code], [description]) VALUES (N'3', N'P', N'Publico')
GO

INSERT INTO [dbo].[tipo_sector] ([id], [code], [description]) VALUES (N'4', N'R', N'Privado')
GO

SET IDENTITY_INSERT [dbo].[tipo_sector] OFF
GO


-- ----------------------------
-- Auto increment value for genero
-- ----------------------------
DBCC CHECKIDENT ('[dbo].[genero]', RESEED, 5)
GO


-- ----------------------------
-- Auto increment value for tipo_cliente
-- ----------------------------
DBCC CHECKIDENT ('[dbo].[tipo_cliente]', RESEED, 4)
GO


-- ----------------------------
-- Auto increment value for tipo_identificacion
-- ----------------------------
DBCC CHECKIDENT ('[dbo].[tipo_identificacion]', RESEED, 15)
GO


-- ----------------------------
-- Auto increment value for tipo_sector
-- ----------------------------
DBCC CHECKIDENT ('[dbo].[tipo_sector]', RESEED, 4)
GO

