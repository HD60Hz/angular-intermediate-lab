import { Film } from './film';
import { InMemoryDbService } from 'angular-in-memory-web-api';


export class FilmData implements InMemoryDbService {

  createDb() {
    const films: Film[] = [
      {
        'id': 1,
        'filmName': 'Scarface',
        'filmCode': 'FILM-001',
        'releaseDate': '7 mars 1984',
        'description': 'En 1980, Tony "Scarface" Montana bénéficie d\'une amnistie du gouvernement cubain pour retourner en Floride.Ambitieux et sans scrupules, il élabore un plan pour éliminer un caïd de la pègre et prendre la place qu\'il occupait sur le marché de la drogue.15 gallon capacity rolling garden cart',
        'price': 32.99,
        'starRating': 5,
        'imageUrl': '../../assets/films/scarface.jpg',
        'category': 'Action, Drame',
        'acteurs': ['Al Pacino', 'Michelle Pfeiffer', 'Steven Bauer', 'Robert Loggia']
      },
      {
        'id': 2,
        'filmName': 'Gran Torino',
        'filmCode': 'FILM-002',
        'releaseDate': '25 février 2009',
        'description': 'Walt Kowalski est un ancien de la guerre de Corée, un homme inflexible, amer et pétri de préjugés surannés. Hormis sa chienne Daisy, il ne fait confiance qu\'à son M- 1, toujours propre, toujours prêt à l\'usage',
        'price': 30,
        'starRating': 4.2,
        'imageUrl': '../../assets/films/gran_torino.jpg',
        'category': 'Drame, Thriller',
        'acteurs': ['Clint Eastwood', 'BEE VANG', 'AHNEY HER', 'GERALDINE HUGHES']
      },
      {
        'id': 5,
        'filmName': 'Braveheart',
        'filmCode': 'FILM-003',
        'releaseDate': '4 octobre 1995',
        'description': 'Evocation de la vie tumultueuse de William Wallace, héros et symbole de l\'indépendance écossaise, qui à la fin du XIIIe siècle affronta les troupes du roi d\'Angleterre Edward I qui venaient d\'envahir son pays.',
        'price': 22,
        'starRating': 4.5,
        'imageUrl': '../../assets/films/braveheart.jpg',
        'category': 'Biopic, Drame',
        'acteurs': ['MEL GIBSON', 'SOPHIE MARCEAU', 'CATHERINE MCCORMACK', 'PATRICK MCGOOHAN']
      },
      {
        'id': 8,
        'filmName': 'Gladiator',
        'filmCode': 'FILM-022',
        'releaseDate': '20 juin 2000',
        'description': 'Le général romain Maximus est le plus fidèle soutien de l\'empereur Marc Aurèle, qu\'il a conduit de victoire en victoire avec une bravoure et un dévouement exemplaires. Jaloux du prestige de Maximus, et plus encore de l\'amour que lui voue l\'empereur, le fils de MarcAurèle, Commode, s\'arroge brutalement le pouvoir, puis ordonne l\'arrestation du général et son exécution. Maximus échappe à ses assassins mais ne peut empêcher le massacre de sa famille. Capturé par un marchand d\'esclaves, il devient gladiateur et prépare sa vengeance.',
        'price': 41.55,
        'starRating': 4.1,
        'imageUrl': '../../assets/films/Gladiator.jpg',
        'category': 'Péplum, Aventure',
        'acteurs': ['MEL GIBSON', 'SOPHIE MARCEAU', 'CATHERINE MCCORMACK', 'PATRICK MCGOOHAN']
      },
      {
        'id': 10,
        'filmName': 'Stalingrade',
        'filmCode': 'FILM-009',
        'releaseDate': '16 mars 2001',
        'description': `Automne 1942. Pendant le siège de Stalingrad par les Allemands, le tireur d'élite russe Vassili Zaitsev est repéré par l'officier politique Danilov, qui décide de faire de lui un héros de propagande. Le siège s'éternisant, l'état major allemand dépêche à son meilleur sniper pour l'éliminer.`,
        'price': 35.95,
        'starRating': 3.9,
        'imageUrl': '../../assets/films/stalingrad.jpg',
        'category': 'Gaming'
      }
    ];
    return { films };
  }
}
