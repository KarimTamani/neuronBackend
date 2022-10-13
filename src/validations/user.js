import { Op } from "sequelize";
import * as yup from "yup";
import db from "../../models";

export const signUpValidator = yup.object({

    

    email: yup.string().email().test("email-exists", "This Email is taken", async (email) => {
        var user = await db.User.findOne({
            where: {
                email: email
            }
        });
        return !user;

    }),
    phone: yup.string().notRequired().matches(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g)
        .test("phone-exists", "This phone number is taken", async (phone) => {
            if (phone)
                var user = await db.User.findOne({
                    where: {
                        phone: phone
                    }
                });
            return !user;
        }),

    password: yup.string().required().min(6),

})



export const loginValidator = yup.object({
    identifier: yup.string().required().min(6),
    password: yup.string().required().min(6)
});

export const editProfilValidator = (userId) => {
    return yup.object({

        name: yup.string().required().min(3),
        lastname: yup.string().required().min(3),

        email: yup.string().email().test("email-exists", "This Email is taken", async (email) => {
            var user = await db.User.findOne({

                where: {
                    id: {
                        [Op.not]: userId
                    },
                    email: email
                }
            });


            return !user;

        }),
        phone: yup.string().notRequired().matches(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g)
            .test("phone-exists", "This phone number is taken", async (phone) => {
                if (phone)
                    var user = await db.User.findOne({
                        where: {
                            phone: phone,
                            id: {
                                [Op.not]: userId
                            }
                        }
                    });
                return !user;
            }),

        occupation: yup.string().nullable().notRequired().min(3)
    })
}

