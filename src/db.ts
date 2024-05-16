import {Sequelize} from "sequelize";
import {DB_HOST, DB_NAME, DB_PASSWORD, DB_USER} from "./config";

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'postgres',
    logging: false
});
sequelize.sync({force: false})
    .then(() => {
        console.log('Database synchronized');
    })
    .catch((error: any) => {
        console.error('Failed to synchronize database:', error);
    });


export default sequelize
