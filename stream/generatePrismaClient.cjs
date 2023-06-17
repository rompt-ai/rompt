/* eslint-disable no-undef */
const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

const prismaProjectRelativePath = path.join(__dirname, "../",);
const prismaProjectSchemaPath = path.join(prismaProjectRelativePath, "prisma", "schema.prisma");
const thisProjectSchemaPath = path.join("prisma", "schema.prisma");

if (!fs.existsSync("prisma")) {
    fs.mkdirSync("prisma");
}

// Copy the schema from Project A to Project B.
fs.copyFileSync(prismaProjectSchemaPath, thisProjectSchemaPath)

const schemaContent = fs.readFileSync(thisProjectSchemaPath, 'utf-8');

// Write the updated schema content back to the file
fs.writeFileSync(thisProjectSchemaPath, schemaContent, 'utf-8');
