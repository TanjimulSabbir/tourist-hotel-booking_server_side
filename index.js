const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { json } = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

// Middle Ware
app.use(cors());
app.use(express.json());

// Port
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log('Tourist Hotel Booking is Running', port)
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mpmd8xf.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const ResortServicesCollections = client.db("Tourist-Hotel").collection("ResortServices");
        const AccomodationCollections = client.db("Tourist-Hotel").collection("Accomodation");
        const BlogsCollections = client.db("Tourist-Hotel").collection("Blogs");
        const DiningRestaurantCollections = client.db("Tourist-Hotel").collection("DiningRestaurant");
        const FitnessCollections = client.db("Tourist-Hotel").collection("Fitness");
        const OffersCollections = client.db("Tourist-Hotel").collection("Offers");
        const OutDoorActivityCollections = client.db("Tourist-Hotel").collection("OutDoorActivity");
        const SpaWellnessCollections = client.db("Tourist-Hotel").collection("SpaWellness");
        const TransportationCollections = client.db("Tourist-Hotel").collection("Transportation");
        const ShopCollections = client.db("Tourist-Hotel").collection("Shop");
        const BusinessCollections = client.db("Tourist-Hotel").collection("Business");
        const WeddingCollections = client.db("Tourist-Hotel").collection("Wedding");
        const LoginUsersCollections = client.db("Tourist-Hotel").collection("LoginUsers");
        const AdminUsersCollections = client.db("Tourist-Hotel").collection("AdminUsers");
        const BookingCollections = client.db("Tourist-Hotel").collection("Booking");
        const GalleryCollections = client.db("Tourist-Hotel").collection("Gallery");

        // Create JSON WEB TOKEN for Login and SignUp
        app.post('/jwt', async (req, res) => {
            try {
                const UserData = req.body.UserData;
                if (!UserData) {
                    return res.status(401).send({ message: 'unauthorized access', status: 401 });
                }
                const secretKey = process.env.ACCESS_TOKEN_SERECT_KEY
                const accessToken = jwt.sign({
                    name: UserData.name,
                    email: UserData.email
                }, secretKey, { expiresIn: '2h' });
                return res.status(201).send({ success: true, message: 'JWT Token Created Successfully', data: accessToken })
            } catch (error) {
                return res.status(500).send({ error })
            }
        })
        // JWT Verify MiddleWare/Function
        function VerifyJWT(req, res, next) {
            const AuthHeader = req.headers.authorization;
            if (!AuthHeader) {
                return res.status(401).send({ message: 'unauthorized access', status: 401 })
            }
            const Token = AuthHeader.split(' ')[1]
            if (!Token) {
                return res.status(401).send({ message: 'unauthorized access', status: 401 })
            }
            jwt.verify(Token, process.env.ACCESS_TOKEN_SERECT_KEY, (err, decoded) => {
                if (err) {
                    return res.status(403).send({ message: 'Forbidden Access', status: 403 })
                }
                req.decoded = decoded;
                next();
            })
        };
        // Check here User Login email and JWT Verification email Matched
        const CheckLoginAndJWTEmail = async (req, res, next) => {
            const decoded = req.decoded;
            const UserEmail = req.params.id;
            if (!UserEmail) {
                return res.status(403).send({ message: 'Forbidden Access', status: 403 });
            }

            if (decoded.email !== UserEmail) {
                return res.status(401).send({ message: 'Unauthorized Access', status: 401 });
            }
            next()
        }

        app.get('/services', async (req, res) => {
            const query = {}
            const result = await ResortServicesCollections.find(query).toArray();
            res.status(201).send(result)
        })
        app.get('/rooms', async (req, res) => {
            const query = {};
            const result = await AccomodationCollections.find(query).toArray();
            res.status(201).send(result);
        })
        app.get('/blogs', async (req, res) => {
            const query = {};
            const result = await BlogsCollections.find(query).toArray();
            res.status(201).send(result);
        })
        app.get('/offers', async (req, res) => {
            const query = {};
            const result = await OffersCollections.find(query).toArray();
            res.status(201).send(result);
        })
        app.get('/spa', async (req, res) => {
            const query = {};
            const result = await SpaWellnessCollections.find(query).toArray();
            res.status(201).send(result);
        })
        app.get('/transportation', async (req, res) => {
            const query = {};
            const result = await TransportationCollections.find(query).toArray();
            res.status(201).send(result);
        })
        app.get('/fitness', async (req, res) => {
            const query = {};
            const result = await FitnessCollections.find(query).toArray();
            res.status(201).send(result);
        })
        app.get('/outdoor', async (req, res) => {
            const query = {};
            const result = await OutDoorActivityCollections.find(query).toArray();
            res.status(201).send(result);
        })
        app.get('/business', async (req, res) => {
            const query = {};
            const result = await BusinessCollections.find(query).toArray();
            res.status(201).send(result);
        })
        app.get('/shop', async (req, res) => {
            const query = {};
            const result = await ShopCollections.find(query).toArray();
            res.status(201).send(result);
        })
        app.get('/restaurant', async (req, res) => {
            const query = {};
            const result = await DiningRestaurantCollections.find(query).toArray();
            res.status(201).send(result);
        })
        app.get('/wedding', async (req, res) => {
            const query = {};
            const result = await WeddingCollections.find(query).toArray();
            res.status(201).send(result);
        })
        app.get('/gallery', async (req, res) => {
            const query = {};
            const result = await GalleryCollections.find(query).toArray();
            res.status(201).send(result);
        })
        // Add Login Users in Database from Login/ AuthProvider
        app.post('/alluser/:id', VerifyJWT, CheckLoginAndJWTEmail, async (req, res) => {
            try {
                const UserData = req.body.UserData;
                if (!UserData) {
                    return res.status(400).send({ message: 'Bad request: No data sent from client', status: 400 });
                }
                const alreadyAdded = await LoginUsersCollections.find({ email: UserData.email }).toArray();
                if (alreadyAdded.length) {
                    return res.status(409).send({ message: 'User already Added', status: 409 })
                }
                const result = await LoginUsersCollections.insertOne({ name: UserData.name, email: UserData.email });
                if (result) {
                    return res.status(201).send({ success: true, message: 'User Added Successfully', data: result })
                }
            } catch (error) {
                return res.status(500).send({ error })
            }

        })
        // User Admin Checking
        async function AdminCheck(req, res, next) {
            const UserEmail = req.params.id;
            const Admin = await AdminUsersCollections.find({
                email: UserEmail,
                userType: 'Admin'
            }).toArray();
            if (!Admin.length) {
                return res.status(400).send({ message: 'You are not Admin', status: 400 });
            }
            next()
        }
        // User Admin/Moderator Checking
        async function AdminModeratorCheck(req, res, next) {
            const UserEmail = req.params.id;
            const MatchedUser = await AdminUsersCollections.findOne({ email: UserEmail });
            if (!MatchedUser) {
                return res.status(400).send({ message: 'You are not in Admin/Moderator list', status: 400 });
            }
            const AdminModerator = ["Admin", "Moderator"]
            if (!(AdminModerator.includes(MatchedUser.userType))) {
                return res.status(400).send({ message: 'You are not Admin/Moderator', status: 400 });
            }
            next()
        }
        // Making Admin
        app.post('/admin/:id', VerifyJWT, CheckLoginAndJWTEmail, AdminCheck, async (req, res) => {
            try {
                const UserData = req.body.UserData;
                const UserDataEmail = UserData.email;
                const AlreadyAdded = await AdminUsersCollections.findOne({ email: UserDataEmail })
                if (AlreadyAdded) {
                    return res.status(409).send({ message: `${UserDataEmail} Already Added`, status: 409 });
                }
                const AdminUser = await AdminUsersCollections.find().toArray();
                if (AdminUser.length >= 6) {
                    return res.status(409).send({ message: 'Maximum user already Added', status: 409 })
                }
                const result = await AdminUsersCollections.insertOne({
                    email: UserData.email,
                    userType: UserData.userType
                });
                const userType = UserData.userType;
                const role = userType.startsWith("A") ? "an Admin" : `a ${userType}`;
                res.status(201).send({ success: true, message: `${UserDataEmail} Added Successfully as ${role}`, data: result });
            } catch (error) {
                return res.status(500).send({ error })
            }
        })
        // Admin User get
        app.get('/admin/:id', VerifyJWT, CheckLoginAndJWTEmail, async (req, res) => {
            try {
                const UserEmail = req.params.id;
                const AdminModerator = ["Admin", "Moderator"];
                const MatchedUser = await AdminUsersCollections.findOne({ email: UserEmail });

                if (!(AdminModerator.includes(MatchedUser.userType))) {
                    return res.status(400).send({ message: 'You are not Admin/Moderator', status: 400 });
                }
                const result = await AdminUsersCollections.find().toArray();
                if (result) {
                    return res.status(200).send({
                        success: true,
                        message: 'Data retrieved successfully',
                        data: result
                    })
                }
            } catch (error) {
                return res.status(500).send({ message: error, status: 500 });
            }
        })
        // Admin User Delete
        app.delete('/admin/:id', VerifyJWT, CheckLoginAndJWTEmail, AdminCheck, async (req, res) => {
            const DeleteEmail = req.body;
            try {
                const ReservedUser = ["tanzimulislamsabbir@gmail.com", "tanjimulislamsabbir02@gmail.com"]
                if (ReservedUser.includes(DeleteEmail.email)) {
                    return res.status(409).send({ message: `${DeleteEmail.email} is a reserved user. You can not delete this user.`, status: 409 })
                }
                const result = await AdminUsersCollections.deleteOne({ email: DeleteEmail.email });
                if (result.deletedCount) {
                    // 204 status code didn't response client side any data so I use 200.
                    return res.status(200).send({ success: true, message: `${DeleteEmail.email} deleted Successfully`, data: result });
                }
            } catch (error) {
                return res.status(500).send({ error });
            }
        })

        // Get Login User from Dashboard AllUser
        app.get('/alluser/:id', VerifyJWT, CheckLoginAndJWTEmail, AdminModeratorCheck, async (req, res) => {
            try {
                const result = await LoginUsersCollections.find().toArray();
                if (result) {
                    return res.status(200).send({
                        success: true,
                        message: 'Data retrieved successfully',
                        data: result
                    })
                }
            } catch (error) {
                return res.status(500).send({ message: error, status: 500 });
            }
        })
        // Update Database Login User profile
        app.put('/alluser/:id', VerifyJWT, CheckLoginAndJWTEmail, async (req, res) => {
            const filter = { email: req.params.id }
            const Userdata = req.body.UserData;
            if (!Userdata) {
                res.status(400).send({
                    success: false,
                    message: "Bad request: No data sent from client",
                    data: null,
                    status: 400
                });
            }
            try {
                const update = { $set: { ...Userdata } }
                const result = await LoginUsersCollections.updateOne(filter, update)
                if (result) {
                    return res.status(201).send({ success: true, message: 'User Updated Successfully', data: result });
                }
            } catch (error) {
                return res.status(500).send({ error });
            }
        })
        // Delete Login User from Dashboard AllUser (Admin)
        app.delete('/alluser/:id', VerifyJWT, CheckLoginAndJWTEmail, AdminCheck, async (req, res) => {
            const data = req.body;
            try {
                const result = await LoginUsersCollections.deleteOne({ email: data.email });
                if (result.deletedCount) {
                    return res.status(200).send({ success: true, message: 'User Deleted Successfully', data: result });
                }

            } catch (error) {
                return res.status(500).send({ error });
            }
        });
        // Delete Booking from Dashboard AllBooking (User)
        app.delete('/booking/:id', VerifyJWT, CheckLoginAndJWTEmail, async (req, res) => {
            const data = req.body;
            const UserEmail = req.params.id;
            if (UserEmail !== data.email) {
                return res.status(409).send({ message: "Only user can be deleted", status: 409 })
            }
            try {
                const result = await BookingCollections.deleteOne({ ...data });
                if (result) {
                    return res.status(200).send({ success: true, message: `${data.bookingName} deleted Successfully`, data: result });
                }

            } catch (error) {
                return res.status(500).send({ error });
            }
        });
        // Add Booking Information from RoomDetails/form
        app.post('/booking/:id', VerifyJWT, CheckLoginAndJWTEmail, async (req, res) => {
            const BookingData = req.body.UserData;
            const userEmail = req.params.id;
            try {
                if (!BookingData) {
                    return res.status(400).send({
                        message: "Bad request: No data sent from client",
                        status: 400
                    });
                }
                const alreadyAdded = await BookingCollections.findOne({ email: userEmail, date: BookingData.date, bookingName: BookingData.bookingName });
                if (alreadyAdded) {
                    return res.status(409).send({ message: `${BookingData.bookingName} Already Booked on ${alreadyAdded.date}`, status: 409 })
                }
                const result = await BookingCollections.insertOne({ ...BookingData });
                if (result.acknowledged) {
                    return res.status(201).send({ success: true, message: `${BookingData.bookingName} Booking Successful on ${BookingData.date}`, data: result.ops });
                } else {
                    throw new Error('Failed to insert booking data');
                }
            } catch (error) {
                return res.status(500).send(error);
            }
        })
        // Get Booking Information from /RoomDetails/form
        app.get('/booking/:id', VerifyJWT, CheckLoginAndJWTEmail, async (req, res) => {
            const userEmail = req.params.id;
            try {
                const FindAdmin = await AdminUsersCollections.findOne({ email: userEmail });
                if (FindAdmin) {
                    const AdminModerator = ["Admin", "Moderator"]
                    if (AdminModerator.includes(FindAdmin.userType)) {
                        const result = await BookingCollections.find().toArray();
                        return res.status(200).send({
                            success: true,
                            message: 'Data retrieved successfully',
                            data: result
                        })
                    }
                }
                const result = await BookingCollections.find({ email: userEmail }).toArray();
                return res.status(200).send({
                    success: true,
                    message: 'Data retrieved successfully',
                    data: result
                })
            } catch (error) {
                return res.status(500).send({ error });
            }
        })
    }
    finally {
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Tourist Hotel Booking is Running')
})