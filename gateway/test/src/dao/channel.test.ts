import app from '../../../src/server'
import ChannelDAO from '../../../src/dao/channel'
import { Channel, ChannelName, } from '../../../src/entity/Channel'
import { getRepository, getConnection, } from 'typeorm';

const deleteAllContents = () => {
  return getConnection().synchronize(true)
}

describe('Point DAO', () => {
  beforeAll(async () => {
    await app.start()
  })

  afterAll(async () => {
    await app.stop()
  })

  describe('Save channel', () => {
    beforeEach(async () => {
      await deleteAllContents()
    })

    it('Should save channel with name phone', async () => {
      const channel = new Channel()
      channel.name = ChannelName.PHONE

      const channelRes = await ChannelDAO.save(channel)
      const allChannels = await getRepository(Channel).find()
      expect(allChannels.length).toEqual(1)
      expect(allChannels[0]!.name).toEqual(channelRes!.name)
    })

    it('Should save channel with name chat', async () => {
      const channel = new Channel()
      channel.name = ChannelName.CHAT

      const channelRes = await ChannelDAO.save(channel)
      const allChannels = await getRepository(Channel).find()
      expect(allChannels.length).toEqual(1)
      expect(allChannels[0]!.name).toEqual(channelRes!.name)
    })

    it('Should save channel with name video', async () => {
      const channel = new Channel()
      channel.name = ChannelName.VIDEO

      const channelRes = await ChannelDAO.save(channel)
      const allChannels = await getRepository(Channel).find()
      expect(allChannels.length).toEqual(1)
      expect(allChannels[0]!.name).toEqual(channelRes!.name)
    })

    it('Should save channel with name audio', async () => {
      const channel = new Channel()
      channel.name = ChannelName.AUDIO

      const channelRes = await ChannelDAO.save(channel)
      const allChannels = await getRepository(Channel).find()
      expect(allChannels.length).toEqual(1)
      expect(allChannels[0]!.name).toEqual(channelRes!.name)
    })

    it('Should save channel with name physical', async () => {
      const channel = new Channel()
      channel.name = ChannelName.PHYSICAL

      const channelRes = await ChannelDAO.save(channel)
      const allChannels = await getRepository(Channel).find()
      expect(allChannels.length).toEqual(1)
      expect(allChannels[0]!.name).toEqual(channelRes!.name)
    })
  })
})
