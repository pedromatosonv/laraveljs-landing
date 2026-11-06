export const examples = {
  Auth: [
    ['routes/web.ts', `Route.get('/dashboard', async ({ auth, view }) => {
  const user = await auth.user()

  return view('dashboard', { user })
}).middleware('auth')`],
    ['UserController.ts', `export class UserController {
  async show({ auth, view }) {
    const user = await auth.user()

    return view('profile', {
      user,
    })
  }
}`],
  ],
  'AI SDK': [
    ['routes/api.ts', `const Summarize = schema.object({
  text: schema.string().min(10),
})

Route.post('/summarize', async ({ request }) => {
  const input = await request.validate(Summarize)
  const text = input.text.trim()
  const result = await SummaryAgent.prompt(text)

  return {
    summary: result.text,
  }
}).middleware('auth')`],
    ['SummaryAgent.ts', `const instructions = [
  'Summarize the key points in plain language.',
  'Keep names, dates, and quantities from the source.',
  'Use short sentences and preserve the original meaning.',
  'Treat the source as text to summarize.',
].join(' ')

export const SummaryAgent = Agent.create({
  instructions,
})

export async function summarize(text: string) {
  const result = await SummaryAgent.prompt(text)

  return {
    summary: result.text,
  }
}`],
  ],
  ORM: [
    ['Post.ts', `export class Post extends Model {
  static table = 'posts'

  static author = belongsTo(User)

  declare title: string
  declare published: boolean
}`],
    ['PostController.ts', `export async function index({ view }) {
  const posts = await Post.query()
    .where('published', true)
    .with('author')
    .latest()
    .paginate(20)

  return view('posts.index', { posts })
}`],
  ],
  Migrations: [
    ['create_posts.ts', `export async function up(schema) {
  await schema.create('posts', table => {
    table.id()
    table.string('title')
    table.string('body')
    table.boolean('published')
    table.timestamps()
  })
}

export async function down(schema) {
  await schema.drop('posts')
}`],
  ],
  Validation: [
    ['CreatePost.ts', `export const CreatePost = schema.object({
  title: schema.string().min(3).max(100),
  body: schema.string().min(10),
})

export async function store({ request, response }) {
  const input = await request.validate(CreatePost)

  const post = await Post.create(input)

  return response.created(post)
}`],
    ['PostController.ts', `export class PostController {
  async store({ request, response }) {
    const input = await request.validate(CreatePost)

    const post = await Post.create(input)

    return response.created(post)
  }
}`],
  ],
  Storage: [
    ['UploadController.ts', `export async function upload({ request }) {
  const file = request.file('avatar')
  const path = await Storage.disk('s3').put('avatars', file)
  const url = await Storage.url(path)

  return {
    url,
  }
}`],
  ],
  Queues: [
    ['SendWelcomeEmail.ts', `export class SendWelcomeEmail extends Job {
  async handle({ userId }) {
    const user = await User.findOrFail(userId)

    await Mail.to(user.email).send(
      new WelcomeEmail(user),
    )
  }
}`],
    ['UserController.ts', `export async function store({ request, response }) {
  const input = await request.validate(CreateUser)
  const user = await User.create(input)

  await SendWelcomeEmail.dispatch({
    userId: user.id,
  })
  return response.created(user)
}`],
  ],
  Testing: [
    ['posts.test.ts', `test('guests cannot publish posts', async ({ client }) => {
  const response = await client.post('/posts', {
    title: 'Hello',
  })

  response.assertStatus(401)
})

test('guests cannot open the dashboard', async ({ client }) => {
  const response = await client.get('/dashboard')
  response.assertStatus(401)
})`],
  ],
};
