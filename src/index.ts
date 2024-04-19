import { createServer } from 'http';
import { Server } from 'socket.io';
import { wrapSocketAsync } from './utils/handler';
import tokenService from './services/token.services';
import sessionStore from './utils/sessionStore';
import followService from './services/follower.services';
import { NotificationConstructor } from './models/Notification.schema';
import app from './server';
import notificationService from './services/notification.services';
const server = createServer(app)
const io = new Server(server, { cors: { origin: '*' } })

interface UserInPage {
  userID: string
  name: string
  username: string
  avatar: string
  isOnline?: boolean
}

io.use(
  wrapSocketAsync(async (socket: any, next: any) => {
    const accessToken = socket.handshake.auth.accessToken
    if (accessToken) {
      const decodedAT = await tokenService.decodeAccessToken(accessToken)
      if (decodedAT) {
        return next()
      } else {
        return next(new Error('Access token expired'))
      }
    }
    return next(new Error('User unauthorized'))
  })
)

io.on('connection', async (socket: any) => {
  const followings = socket.handshake.auth.followings
  const userID = socket.handshake.auth.id
  const username = socket.handshake.auth.username
  sessionStore.saveSession(userID, {
    userID,
    username: username,
    socketID: socket.id,
  })
  let users: UserInPage[] = []
  if (followings) {
    users = followings
  } else {
    const data = await followService.getAllFollowers(userID)
    users = data.map((user: any) => {
      return {
        userID: user.follower_user._id.toString(),
        name: user.follower_user.name,
        username: user.follower_user.username,
        avatar: user.follower_user.avatar,
        isOnline: sessionStore.findSession(user.follower_user._id.toString()) ? true : false
      }
    })
  }
  socket.emit('users', users)
  socket.on('notify', async (data: NotificationConstructor) => {
    const toUser = sessionStore.findSession(data.to as string)
    if (toUser) {
      socket.to(toUser.socketID).emit('receive notify', data)
      await notificationService.storeNotification(data)
    }
  })
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3002, () => {
  console.log(`App listening on port ${3002}`)
})
