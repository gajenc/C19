import app from '../../../src/server'
import PointDAO from '../../../src/dao/point'
import { Point } from '../../../src/entity/Point'
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

  describe('Save point', () => {
    beforeEach(async () => {
      await deleteAllContents()
    })

    it('Should throw error if point is empty', async () => {
      const point = new Point()

      try {
        await PointDAO.save(point)
      } catch(e) {
        expect(e.message).toEqual("ER_NO_DEFAULT_FOR_FIELD: Field 'lat' doesn't have a default value")
      }
    })

    it('Should throw error if lon is not provided in point', async () => {
      const point = new Point()
      point.lat = 21

      try {
        await PointDAO.save(point)
      } catch(e) {
        expect(e.message).toEqual("ER_NO_DEFAULT_FOR_FIELD: Field 'lon' doesn't have a default value")
      }
    })

    it('Should save point with correct data', async () => {
      const point = new Point()
      point.lat = 21
      point.lon = 32

      const pointRes = await PointDAO.save(point)
      const allPoints = await getRepository(Point).find()
      expect(allPoints.length).toEqual(1)
      expect(allPoints[0]!.lat).toEqual(pointRes!.lat)
      expect(allPoints[0]!.lon).toEqual(pointRes!.lon)
    })
  })
})
