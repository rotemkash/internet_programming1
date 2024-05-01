const { DataTypes } = require('sequelize');
/**
 * Definition of the Ad model.
 * @param {object} sequelize - The Sequelize instance.
 * @returns {object} - The Ad model.
 */
module.exports = sequelize => {
    return sequelize.define('Ad', {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 20] // Title length limited to 20 characters
            }
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 200] // Description length limited to 200 characters
            }
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                min: 0 // Price must be greater than or equal to 0
            }
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: /^\d{2,3}-\d{7}$/ // Phone number format validation
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true // Email validation
            }
        },
        approved: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false // Initially, ads are not approved
        }
    });
};