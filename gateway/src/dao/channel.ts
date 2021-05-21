import { Channel } from '../entity/Channel';
import { getRepository } from 'typeorm';
import logger from '../utils/logger'

class ChannelDAO {
  public save(channel: Channel) {
    const channelRepository = getRepository(Channel)
    return channelRepository.save(channel)
  }

  public saveMany(channels: Array<Channel>) {
    const channelRepository = getRepository(Channel)
    return channelRepository.save(channels)
  }

  public delete(query: any) {
    const channelRepository = getRepository(Channel)
    return channelRepository.delete(query)
  }

  public remove(channels: Array<Channel>) {
    const channelRepository = getRepository(Channel)
    return channelRepository.remove(channels)
  }
}

export default new ChannelDAO()
