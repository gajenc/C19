import { Point } from '../entity/Point';
import { getRepository } from 'typeorm';
import logger from '../utils/logger'

class PointDAO {
  public save(point: Point) {
    const pointRepository = getRepository(Point)    
    return pointRepository.save(point)
  }
}

export default new PointDAO()
