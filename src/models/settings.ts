import Sequelize, {DataTypes, Model} from 'sequelize';
import sequelize from '../db';

class SystemSettings extends Model {}

SystemSettings.init({
    lastBlock: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "0"
    }
}, {
    sequelize,
    modelName: 'SystemSettings'
});

export default SystemSettings
