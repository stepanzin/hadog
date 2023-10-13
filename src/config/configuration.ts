import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import * as process from 'process';

const YAML_CONFIG_FILENAME = 'config.yaml';
const YAML_CONFIG_PATH = join(process.cwd(), YAML_CONFIG_FILENAME);

export default () =>
  yaml.load(readFileSync(YAML_CONFIG_PATH, 'utf8')) as Record<string, any>;
