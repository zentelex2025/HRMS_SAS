// scripts/seedUsers.js
// Run: node scripts/seedUsers.js
// This will INSERT the default admin and HR user into interview_users
// with properly hashed passwords.
//
// Prerequisites:
//   npm install bcryptjs mysql2
//   Your config/db12.js must point to interview_db

const bcrypt = require("bcryptjs");
const { db } = require("../config/db12");

const DEFAULT_USERS = [
  {
    email:    "admin@company.com",
    password: "admin123",
    name:     "Admin User",
    role:     "admin",
    label:    "Administrator",
  },
  {
    email:    "hr@company.com",
    password: "hr123",
    name:     "Priya Mehta",
    role:     "hr",
    label:    "HR Manager",
  },
];

async function createTable() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS \`interview_users\` (
      \`id\`            INT          NOT NULL AUTO_INCREMENT,
      \`email\`         VARCHAR(120) NOT NULL UNIQUE,
      \`password_hash\` VARCHAR(255) NOT NULL,
      \`name\`          VARCHAR(100) NOT NULL,
      \`role\`          ENUM('admin','hr','hod') NOT NULL DEFAULT 'hr',
      \`label\`         VARCHAR(100) NOT NULL DEFAULT 'HR Manager',
      \`is_active\`     TINYINT(1)   NOT NULL DEFAULT 1,
      \`last_login\`    DATETIME     DEFAULT NULL,
      \`created_at\`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (\`id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  console.log("✅ Table `interview_users` ready");
}

async function seedUsers() {
  for (const u of DEFAULT_USERS) {
    const hash = await bcrypt.hash(u.password, 10);

    const [existing] = await db.query(
      "SELECT id FROM interview_users WHERE email = ?", [u.email]
    );

    if (existing.length > 0) {
      console.log(`⚠️  User ${u.email} already exists — skipping`);
      continue;
    }

    await db.query(
      `INSERT INTO interview_users (email, password_hash, name, role, label)
       VALUES (?, ?, ?, ?, ?)`,
      [u.email, hash, u.name, u.role, u.label]
    );
    console.log(`✅ Created: ${u.email}  (password: ${u.password})`);
  }
}

(async () => {
  try {
    await createTable();
    await seedUsers();
    console.log("\n🎉 Seed complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
})();