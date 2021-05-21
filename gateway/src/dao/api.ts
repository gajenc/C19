import { Api } from '../entity/Api';
import { getRepository } from 'typeorm';
import logger from '../utils/logger'

class ApiDAO {
  public save(api: Api) {
    const apiRepository = getRepository(Api)
    return apiRepository.save(api)
  }

  public saveMany(apis: Array<Api>) {
    const apiRepository = getRepository(Api)
    return apiRepository.save(apis)
  }

  public delete(query: any) {
    const apiRepository = getRepository(Api)
    return apiRepository.delete(query)
  }

  public remove(apis: Array<Api>) {
    const apiRepository = getRepository(Api)
    return apiRepository.remove(apis)
  }

  public findOne(data: any) {
    const apiRepository = getRepository(Api);
    return apiRepository.findOne(data)
  }
}

export default new ApiDAO()
