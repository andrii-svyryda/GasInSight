from uuid import uuid4, UUID
import json
import random
from faker import Faker
from models.facility import Facility
from models.sensor import Sensor
from constants.facility_types import FacilityTypes
from constants.sensor_types import SensorTypes

fake = Faker()
facilities_count = 10

cities = [
    # Europe
    ("London", "10 Downing Street, London, UK", 51.5074, -0.1278),
    ("Paris", "16 Avenue de la Grande Armée, Paris, France", 48.8566, 2.3522),
    ("Berlin", "Unter den Linden 77, Berlin, Germany", 52.5200, 13.4050),
    ("Madrid", "Calle Mayor 1, Madrid, Spain", 40.4168, -3.7038),
    ("Rome", "Via del Corso 1, Rome, Italy", 41.9028, 12.4964),
    ("Amsterdam", "Dam Square 1, Amsterdam, Netherlands", 52.3676, 4.9041),
    ("Brussels", "Grand Place 1, Brussels, Belgium", 50.8476, 4.3572),
    ("Vienna", "Stephansplatz 1, Vienna, Austria", 48.2082, 16.3738),
    ("Stockholm", "Drottninggatan 1, Stockholm, Sweden", 59.3293, 18.0686),
    ("Copenhagen", "Rådhuspladsen 1, Copenhagen, Denmark", 55.6761, 12.5683),
    ("Oslo", "Karl Johans gate 1, Oslo, Norway", 59.9139, 10.7522),
    ("Helsinki", "Mannerheimintie 1, Helsinki, Finland", 60.1699, 24.9384),
    ("Warsaw", "Nowy Świat 1, Warsaw, Poland", 52.2297, 21.0122),
    ("Prague", "Old Town Square 1, Prague, Czech Republic", 50.0755, 14.4378),
    ("Budapest", "Andrássy út 1, Budapest, Hungary", 47.4979, 19.0402),
    ("Athens", "Syntagma Square 1, Athens, Greece", 37.9838, 23.7275),
    ("Lisbon", "Praça do Comércio 1, Lisbon, Portugal", 38.7223, -9.1393),
    ("Dublin", "O'Connell Street 1, Dublin, Ireland", 53.3498, -6.2603),
    ("Zurich", "Bahnhofstrasse 1, Zurich, Switzerland", 47.3769, 8.5417),
    ("Munich", "Marienplatz 1, Munich, Germany", 48.1351, 11.5820),
    ("Milan", "Piazza del Duomo 1, Milan, Italy", 45.4642, 9.1900),
    ("Barcelona", "La Rambla 1, Barcelona, Spain", 41.3851, 2.1734),
    ("Frankfurt", "Römerberg 1, Frankfurt, Germany", 50.1109, 8.6821),
    ("Rotterdam", "Coolsingel 1, Rotterdam, Netherlands", 51.9244, 4.4777),
    ("Lyon", "Place Bellecour 1, Lyon, France", 45.7640, 4.8357),
    ("Hamburg", "Rathausmarkt 1, Hamburg, Germany", 53.5511, 9.9937),
    ("Marseille", "Vieux-Port 1, Marseille, France", 43.2965, 5.3698),
    ("Valencia", "Plaza del Ayuntamiento 1, Valencia, Spain", 39.4699, -0.3763),
    ("Seville", "Plaza de España 1, Seville, Spain", 37.3891, -5.9845),
    ("Naples", "Via Toledo 1, Naples, Italy", 40.8518, 14.2681),

    # USA
    ("New York", "350 5th Avenue, New York, USA", 40.7128, -74.0060),
    ("Los Angeles", "200 N Spring St, Los Angeles, USA", 34.0522, -118.2437),
    ("Chicago", "121 N LaSalle St, Chicago, USA", 41.8781, -87.6298),
    ("Houston", "901 Bagby St, Houston, USA", 29.7604, -95.3698),
    ("Phoenix", "200 W Washington St, Phoenix, USA", 33.4484, -112.0740),
    ("Philadelphia", "1401 JFK Blvd, Philadelphia, USA", 39.9526, -75.1652),
    ("San Antonio", "100 Military Plaza, San Antonio, USA", 29.4241, -98.4936),
    ("San Diego", "202 C St, San Diego, USA", 32.7157, -117.1611),
    ("Dallas", "1500 Marilla St, Dallas, USA", 32.7767, -96.7970),
    ("San Jose", "200 E Santa Clara St, San Jose, USA", 37.3382, -121.8863),
    ("Austin", "301 W 2nd St, Austin, USA", 30.2672, -97.7431),
    ("Jacksonville", "117 W Duval St, Jacksonville, USA", 30.3322, -81.6557),
    ("San Francisco", "1 Dr Carlton B Goodlett Pl, San Francisco, USA", 37.7749, -122.4194),
    ("Columbus", "90 W Broad St, Columbus, USA", 39.9612, -82.9988),
    ("Fort Worth", "200 Texas St, Fort Worth, USA", 32.7555, -97.3308),
    ("Indianapolis", "200 E Washington St, Indianapolis, USA", 39.7684, -86.1581),
    ("Charlotte", "600 E 4th St, Charlotte, USA", 35.2271, -80.8431),
    ("Seattle", "600 4th Ave, Seattle, USA", 47.6062, -122.3321),
    ("Denver", "1437 Bannock St, Denver, USA", 39.7392, -104.9903),
    ("Washington DC", "1600 Pennsylvania Avenue NW, Washington DC, USA", 38.9072, -77.0369),
    ("Boston", "1 City Hall Square, Boston, USA", 42.3601, -71.0589),
    ("Nashville", "1 Public Square, Nashville, USA", 36.1627, -86.7816),
    ("Las Vegas", "495 S Main St, Las Vegas, USA", 36.1699, -115.1398),
    ("Portland", "1221 SW 4th Ave, Portland, USA", 45.5155, -122.6789),
    ("Oklahoma City", "200 N Walker Ave, Oklahoma City, USA", 35.4676, -97.5164),
    ("Miami", "3500 Pan American Dr, Miami, USA", 25.7617, -80.1918),
    ("Sacramento", "915 I St, Sacramento, USA", 38.5816, -121.4944),
    ("Atlanta", "55 Trinity Ave SW, Atlanta, USA", 33.7490, -84.3880),
    ("New Orleans", "1300 Perdido St, New Orleans, USA", 29.9511, -90.0715),
    ("Minneapolis", "350 S 5th St, Minneapolis, USA", 44.9778, -93.2650),

    # Africa
    ("Cairo", "1 Al Ahram Street, Cairo, Egypt", 30.0444, 31.2357),
    ("Lagos", "Marina Street, Lagos Island, Nigeria", 6.5244, 3.3792),
    ("Johannesburg", "61 Juta Street, Johannesburg, South Africa", -26.2041, 28.0473),
    ("Kinshasa", "Boulevard du 30 Juin, Kinshasa, DRC", -4.4419, 15.2663),
    ("Luanda", "Avenida 4 de Fevereiro, Luanda, Angola", -8.8383, 13.2344),
    ("Khartoum", "Al Qasr Street, Khartoum, Sudan", 15.5007, 32.5599),
    ("Abidjan", "Boulevard Angoulvant, Abidjan, Ivory Coast", 5.3600, -4.0083),
    ("Alexandria", "Corniche Road, Alexandria, Egypt", 31.2001, 29.9187),
    ("Addis Ababa", "Churchill Avenue, Addis Ababa, Ethiopia", 9.0320, 38.7423),
    ("Casablanca", "Place Mohammed V, Casablanca, Morocco", 33.5731, -7.5898),
    ("Nairobi", "City Hall Way, Nairobi, Kenya", -1.2921, 36.8219),
    ("Dakar", "Avenue Léopold Sédar Senghor, Dakar, Senegal", 14.7167, -17.4677),
    ("Dar es Salaam", "Samora Avenue, Dar es Salaam, Tanzania", -6.7924, 39.2083),
    ("Cape Town", "Corporation Street, Cape Town, South Africa", -33.9249, 18.4241),
    ("Accra", "High Street, Accra, Ghana", 5.6037, -0.1870),
    ("Kampala", "Kampala Road, Kampala, Uganda", 0.3476, 32.5825),
    ("Maputo", "Avenida Julius Nyerere, Maputo, Mozambique", -25.9692, 32.5732),
    ("Lusaka", "Independence Avenue, Lusaka, Zambia", -15.3875, 28.3228),
    ("Algiers", "Rue Didouche Mourad, Algiers, Algeria", 36.7538, 3.0588),
    ("Tunis", "Avenue Habib Bourguiba, Tunis, Tunisia", 36.8065, 10.1815),
    ("Rabat", "Avenue Mohammed V, Rabat, Morocco", 34.0209, -6.8416),
    ("Harare", "Samora Machel Avenue, Harare, Zimbabwe", -17.8292, 31.0522),
    ("Durban", "Dr Pixley KaSeme Street, Durban, South Africa", -29.8587, 31.0218),
    ("Port Elizabeth", "Govan Mbeki Avenue, Port Elizabeth, South Africa", -33.9608, 25.6022),
    ("Pretoria", "Church Square, Pretoria, South Africa", -25.7479, 28.2293),
    ("Bamako", "Boulevard du Peuple, Bamako, Mali", 12.6392, -8.0029),
    ("Antananarivo", "Avenue de l'Indépendance, Antananarivo, Madagascar", -18.8792, 47.5079),
    ("Conakry", "Route Le Prince, Conakry, Guinea", 9.6412, -13.5784),
    ("Lubumbashi", "Avenue Lumumba, Lubumbashi, DRC", -11.6876, 27.5026),
    ("Kano", "Kofar Mata Road, Kano, Nigeria", 12.0022, 8.5920)
]

def generate_coordinates(base_lat: float, base_lon: float) -> tuple:
    lat = base_lat + random.uniform(-0.01, 0.01)
    lon = base_lon + random.uniform(-0.01, 0.01)
    return lat, lon

def generate_sensor(address: str, lat: float, lon: float) -> Sensor:
    sensor_type = random.choice(list(SensorTypes))
    return Sensor(
        sensor_id=uuid4(),
        address=address,
        longitude=lon,
        latitude=lat,
        sensor_type=sensor_type
    )

def generate_facility() -> Facility:
    city, address, base_lat, base_lon = random.choice(cities)
    
    facility = Facility(
        facility_id=uuid4(),
        facility_name=f"{city} {random.choice(['DrillingRig', 'Pipelines', 'TankFarm', 'UndergroundStorage', 'ProcessingPlant', 'ImportTerminal', 'ExportTerminal'])}",
        address=address,
        longitude=base_lon,
        latitude=base_lat,
        facility_type=random.choice(list(FacilityTypes))
    )
    
    num_sensors = random.randint(2, 6)
    for _ in range(num_sensors):
        lat, lon = generate_coordinates(base_lat, base_lon)
        sensor = generate_sensor(facility.address, lat, lon)
        facility.sensors.append(sensor)
    
    return facility

class UUIDEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, UUID):
            return str(obj)
        return super().default(obj)

facilities = [generate_facility() for _ in range(facilities_count)]
facilities_json = [facility.model_dump() for facility in facilities]

with open('facilities.json', 'w') as f:
    json.dump(facilities_json, f, indent=2, cls=UUIDEncoder)
