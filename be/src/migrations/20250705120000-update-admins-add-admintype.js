"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1) Add ENUM type (for Postgres). For MySQL, ENUM will be created automatically.
    if (queryInterface.sequelize.getDialect() === "postgres") {
      await queryInterface.sequelize.query(
        "DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_Admins_admin_type') THEN CREATE TYPE \"enum_Admins_admin_type\" AS ENUM('admin','librarian'); END IF; END$$;"
      );
    }

    // 2) Add column admin_type
    await queryInterface.addColumn("Admins", "admin_type", {
      type: Sequelize.ENUM("admin", "librarian"),
      allowNull: false,
      defaultValue: "librarian",
    });

    // 3) Drop legacy columns if they exist
    const tableDesc = await queryInterface.describeTable("Admins");

    const maybeDrop = async (col) => {
      if (tableDesc[col]) {
        await queryInterface.removeColumn("Admins", col);
      }
    };

    await maybeDrop("access_level");
    await maybeDrop("can_manage_users");
    await maybeDrop("can_manage_books");
  },

  down: async (queryInterface, Sequelize) => {
    // Recreate dropped columns (simplified types)
    await queryInterface.addColumn("Admins", "access_level", {
      type: Sequelize.INTEGER,
    });
    await queryInterface.addColumn("Admins", "can_manage_users", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
    await queryInterface.addColumn("Admins", "can_manage_books", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });

    // Remove admin_type column
    await queryInterface.removeColumn("Admins", "admin_type");

    // Drop ENUM type in Postgres
    if (queryInterface.sequelize.getDialect() === "postgres") {
      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_Admins_admin_type";'
      );
    }
  },
};
