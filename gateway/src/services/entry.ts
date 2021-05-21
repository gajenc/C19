import * as bcrypt from "bcryptjs";
import { Client } from "../entity/Client";
import ClientDAO from "../dao/client";
import ApiDAO from "../dao/api";
import { Api } from "../entity/Api";
import ChannelDAO from "../dao/channel";
import { Channel } from "../entity/Channel";
import ClientTypeDAO from "../dao/client-type";
import { ClientType } from "../entity/ClientType";
import LocationDAO from "../dao/location";
import { Location } from "../entity/Location";
import PointDAO from "../dao/point";
import { Point } from "../entity/Point";
import CityDAO from "../dao/city";
import { City } from "../entity/City";
import CountryDAO from "../dao/country";
import { Country } from "../entity/Country";
import AddressDAO from "../dao/address";
import { Address } from "../entity/Address";
import authHelper from "../utils/auth-helper";
import logger from "../utils/logger";


const saltRounds = 10;
const saveApiEndpoints = async (endpoints: any) => {
  const apiPromise: any = [];
  const apis: any = [];

  (endpoints || []).forEach((apiData: any) => {
    const api = new Api();
    api.type = apiData.type;
    api.url = apiData.url;
    api.exp = apiData.exp;

    apis.push(api);
    apiPromise.push(ApiDAO.save(api));
  });

  await Promise.all(apiPromise);
  return apis;
};

const saveSupportedchannels = async (supported_channels: any) => {
  const supportedchannelsPromise: any = [];
  const channels: any = [];

  (supported_channels || []).forEach((channelData: any) => {
    const channel = new Channel();
    channel.name = channelData.name;
    channels.push(channel);
    supportedchannelsPromise.push(ChannelDAO.save(channel));
  });

  await Promise.all(supportedchannelsPromise);
  return channels;
};

const saveTypes = async (types: any) => {
  const typesPromise: any = [];
  const clientTypes: any = [];

  (types || []).forEach((clientTypeData: any) => {
    const clientType = new ClientType();
    clientType.name = clientTypeData.name;
    clientTypes.push(clientType);
    typesPromise.push(ClientTypeDAO.save(clientType));
  });

  await Promise.all(typesPromise);
  return clientTypes;
};

const saveLocation = async (locationData: any) => {
  if (locationData) {
    const location = new Location();
    location.type = locationData.type;
    location.station_code = locationData.stationCode;
    location.area_code = locationData.areaCode;
    location.polygon = locationData.polygon;
    location.space = locationData.space;
    location.space = locationData.space;

    if (locationData.gps) {
      const point = new Point();
      point.lat = locationData.gps.lat;
      point.lon = locationData.gps.lon;

      await PointDAO.save(point);
      location.gps = point;
    }

    if (locationData.address) {
      const address = new Address();
      address.door = locationData.address.door;
      address.building = locationData.address.building;
      address.street = locationData.address.street;
      address.area = locationData.address.area;
      address.country = locationData.address.country;
      address.area_code = locationData.address.areaCode;

      await AddressDAO.save(address);
      location.address = address;
    }

    if (locationData.city) {
      const city = new City();
      city.name = locationData.city.name;
      city.code = locationData.city.code;

      await CityDAO.save(city);
      location.city = city;
    }

    if (locationData.country) {
      const country = new Country();
      country.name = locationData.country.name;
      country.code = locationData.country.code;

      await CountryDAO.save(country);
      location.country = country;
    }

    await LocationDAO.save(location);
    return location;
  }

  return new Location();
};

class Entry {
  register = async (data: any) => {
    try {
      const {
        name,
        type,
        types,
        email,
        username,
        password,
        phone,
        documents,
        location,
        supported_channels,
        endpoints,
      } = data;

      const encryptedPassword = await bcrypt.hash(password, saltRounds);

      const client = new Client();
      client.name = name;
      client.username = username;
      client.email = email;
      client.password = encryptedPassword;
      client.phone = phone;
      client.documents = documents;
      client.gateway_jwt_secret = authHelper.generateAppSecret();

      const apis = await saveApiEndpoints(endpoints);
      client.endpoints = apis;

      const channels = await saveSupportedchannels(supported_channels);
      client.supported_channels = channels;

      const clientTypes = await saveTypes(types && types.length ? types : [{ name: type.toLowerCase() }]);
      client.types = clientTypes;

      const locationRes = await saveLocation(location);
      client.location = locationRes;

      const clientRes = await ClientDAO.save(client);

      return {
        access_token: authHelper.generateAccessToken({ id: clientRes.id, name: clientRes.name, types: clientRes.types }),
        api_token: authHelper.generateApiToken({ id: clientRes.id, name: clientRes.name, types: clientRes.types }),
        refresh_token: authHelper.generateRefreshToken({ id: clientRes.id, name: clientRes.name, types: clientRes.types }),
        ...clientRes!
      };
    } catch (e) {
      throw (new Error(e));
    }
  }

  login = async (data: any) => {
    const client = await ClientDAO.findOne({
      where: {
        username: data.username
      },
      relations: ["types"]
    });
    if (!client) throw (new Error("invalid username provided"));
    const comparision = await bcrypt.compare(data.password, client!.password);

    if (comparision) {
      return {
        access_token: authHelper.generateAccessToken({ id: client!.id, name: client!.name, types: client!.types }),
        refresh_token: authHelper.generateRefreshToken({ id: client!.id, name: client!.name, types: client!.types }),
        ...client!
      };
    } else {
      throw (new Error("username and password does not match"));
    }
  }

  update = async (data: any) => {
    try {
      const client = await ClientDAO.findOne({
        where: {
          id: data.id
        },
        relations: ["endpoints", "supported_channels", "location"]
      });
      if (!client) throw new Error(`No client found with id ${data.id}`);
      if (data.endpoints) {
        await ApiDAO.remove(client.endpoints);
        const endpoints = await saveApiEndpoints(data.endpoints);
        client.endpoints = endpoints;
      }
      if (data.supported_channels) {
        await ChannelDAO.remove(client.supported_channels);
        const supported_channels = await saveSupportedchannels(data.supported_channels);
        client.supported_channels = supported_channels;
      }

      if (data.types) {
        await ClientTypeDAO.remove(client.types);
        const clientTypes = await saveTypes(data.types);
        client.types = clientTypes;
      }

      if (data.location) {
        await LocationDAO.remove(client.location);
        const location = await saveLocation(data.location);
        client.location = location;
      }

      if (data.active !== undefined) client.active = data.active;
      if (data.serviceable !== undefined) client.serviceable = data.serviceable;
      if (data.email) client.email = data.email;
      if (data.phone) client.phone = data.phone;

      const clientRes = await ClientDAO.save(client);
      return clientRes;
    } catch (error) {
      logger.error("Error in Entry.update ", error);
      throw error;
    };
  }


}

export default Entry;
