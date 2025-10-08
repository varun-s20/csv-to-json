import { query } from '../config/db.js';
import parseCSV from '../utils/csvParse.js';

const uploadData = async () => {
    const uploadedData = [];
    const errors = [];

    try {
        const records = await parseCSV();

        for (const record of records) {
            const {
                'name.firstName': firstName,
                'name.lastName': lastName,
                age,
                'address.line1': addressLine1,
                'address.line2': addressLine2,
                'address.city': city,
                'address.state': state,
                gender,
                ...rest
            } = record;

            // Combine firstName and lastName to form the name field
            const name = `${firstName} ${lastName}`;

            // Create address object
            const address = {
                line1: addressLine1 || null,
                line2: addressLine2 || null,
                city: city || null,
                state: state || null,
            };

            // Additional info object
            const additionalInfo = { ...rest };

            // Validate required fields
            if (!name || !age || !gender) {
                errors.push(`Skipping record due to missing required fields: ${JSON.stringify(record)}`);
                continue; // Skip this record
            }

            try {
                // Insert data into the database
                await query(
                    'INSERT INTO public.users(name, age, address, additional_info, gender) VALUES($1, $2, $3, $4, $5)',
                    [name, parseInt(age, 10), address, additionalInfo, gender]
                );

                // Push formatted data to the uploadedData array
                uploadedData.push({
                    name: {
                        firstName: firstName,
                        lastName: lastName
                    },
                    age: age,
                    address: {
                        line1: addressLine1,
                        line2: addressLine2,
                        city: city,
                        state: state
                    },
                    gender: gender
                });
            } catch (dbError) {
                errors.push(`Error inserting record: ${JSON.stringify(record)}, Error: ${dbError.message}`);
            }
        }

        // Calculate and print age distribution
        await calculateAgeDistribution();

        return { uploadedData, errors };
    } catch (error) {
        throw new Error('Error processing CSV file: ' + error.message);
    }
};

// Function to calculate age distribution
const calculateAgeDistribution = async () => {
    const ageGroups = {
        '<20': 0,
        '20-40': 0,
        '40-60': 0,
        '>60': 0
    };

    try {
        // Fetch all users from the database
        const result = await query('SELECT age FROM public.users');
        const users = result.rows;

        const totalUsers = users.length;

        // Calculate the distribution
        users.forEach(user => {
            const age = parseInt(user.age, 10);
            if (age < 20) ageGroups['<20']++;
            else if (age >= 20 && age <= 40) ageGroups['20-40']++;
            else if (age > 40 && age <= 60) ageGroups['40-60']++;
            else if (age > 60) ageGroups['>60']++;
        });

        // Calculate percentages
        const ageGroupPercentages = {};
        for (const [group, count] of Object.entries(ageGroups)) {
            ageGroupPercentages[group] = ((count / totalUsers) * 100).toFixed(2);
        }

        // Print the report
        console.log('Age-Group % Distribution');
        for (const [group, percentage] of Object.entries(ageGroupPercentages)) {
            console.log(`${group} ${percentage}`);
        }

    } catch (error) {
        console.error('Error calculating age distribution:', error);
    }
};

export default uploadData
