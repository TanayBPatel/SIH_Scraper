const { Sequelize } = require('sequelize');
const config = require('./config');

const sequelize = new Sequelize(
  config.database.name,
  config.database.user,
  config.database.password,
  {
    host: config.database.host,
    port: config.database.port,
    dialect: 'postgres',
    logging: config.server.env === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL Connected successfully');
    
    // Sync all models (create tables if they don't exist, but don't alter existing ones)
    await sequelize.sync({ force: false });
    console.log('✅ Database models synchronized');
    
  } catch (error) {
    console.error('❌ Error connecting to PostgreSQL:', error);
    
    // Check if it's a database connection error
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      console.error('❌ Cannot connect to PostgreSQL server. Please ensure:');
      console.error('   1. PostgreSQL is running on port 5432');
      console.error('   2. Database "master" exists');
      console.error('   3. User credentials are correct');
      console.error('   4. Run: node scripts/init-db.js to verify connection');
    }
    
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
