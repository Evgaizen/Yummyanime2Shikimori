import { program } from 'commander';
import * as fs from 'fs/promises';

enum YummyanimeStatus {
  WATCHING = 1,
  PLANNED = 2,
  COMPLETED = 3,
  FAVORITE = 4,
  DROPPED = 5,
}

enum ShikimoriStatus {
  COMPLETED = 'completed',
  PLANNED = 'planned',
  DROPPED = 'dropped',
  ON_HOLD = 'on_hold',
  REWATCHING = 'rewatching',
  WATCHING = 'watching',
}

interface YummyanimeItem {
  list_id: YummyanimeStatus;
  ya_id: number;
  title: string;
  score: number | null;
  updated_at: string;
  target_id: number;
}

interface ShikimoriItem {
  target_title: string;
  target_id: number;
  target_type: "Anime";
  score: number;
  status: ShikimoriStatus;
  rewatches: 0;
  episodes: 0;
  text: "";
}

const mapStatus = {
  [YummyanimeStatus.COMPLETED]: ShikimoriStatus.COMPLETED,
  [YummyanimeStatus.PLANNED]: ShikimoriStatus.PLANNED,
  [YummyanimeStatus.WATCHING]: ShikimoriStatus.WATCHING,
  [YummyanimeStatus.DROPPED]: ShikimoriStatus.DROPPED,
}

const mapItem = (item: YummyanimeItem): ShikimoriItem | null => {
  if (item.list_id === YummyanimeStatus.FAVORITE) {
    return null;
  }

  return {
    target_title: item.title,
    target_id: item.target_id,
    target_type: 'Anime',
    score: item.score || 0,
    status: mapStatus[item.list_id],
    rewatches: 0,
    episodes: 0,
    text: '',
  }
};

program
    .version('1.0.0')
    .name('Yummyanime2Shikimori')
    .argument('<path>', 'file to convert')
    .action(async (path) => {
    try {
      const file = await fs.readFile(path, 'utf8');
      const list = JSON.parse(file) as YummyanimeItem[];
      const mappedList = list.map(mapItem).filter(Boolean);
      
      await fs.writeFile('out.json', JSON.stringify(mappedList));

      console.log('Done!');
    } catch(e) {
      throw new Error('Something happens!');
    }
  });

program.parse();



