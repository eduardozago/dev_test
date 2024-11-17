import 'reflect-metadata';
import express from 'express';
import { DataSource } from 'typeorm';
import { User } from './entity/User';
import { Post } from './entity/Post';

const app = express();
app.use(express.json());

const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: 3306,
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "test_db",
  entities: [User,Post],
  synchronize: true,
  logging: true
});

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const initializeDatabase = async () => {
  await wait(20000);
  try {
    await AppDataSource.initialize();
    console.log("Data Source has been initialized!");
  } catch (err) {
    console.error("Error during Data Source initialization:", err);
    process.exit(1);
  }
};

initializeDatabase();

app.post('/users', async (req, res) => {
// Crie o endpoint de users
  const userRepository = AppDataSource.getRepository(User)
    
  const { firstName, lastName, email } = req.body

  const user = new User()

  user.firstName = firstName
  user.lastName = lastName
  user.email = email

  const userCreated = await userRepository.save(user)

  res.status(201).send(userCreated)
});

app.get('/users', async (req, res) => {
  const userRepository = AppDataSource.getRepository(User)

  const users = await userRepository.find()

  res.status(200).send(users)
})

app.post('/posts', async (req, res) => {
// Crie o endpoint de posts
  const postRepository = AppDataSource.getRepository(Post)
  const userRepository = AppDataSource.getRepository(User)
    
  const { title, description, userId } = req.body

  const user = await userRepository.findOne({ where: { id: userId }})

  if (!user) {
    throw new Error('User not found')
  }

  const post = new Post()

  post.title = title
  post.description = description
  post.user = user

  const postCreated = await postRepository.save(post)

  res.status(201).send(postCreated)
});

app.get('/posts', async (req, res) => {
  const postRepository = AppDataSource.getRepository(Post)

  const posts = await postRepository.find({
    relations: ['user'],
  })

  res.status(200).send(posts)
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
