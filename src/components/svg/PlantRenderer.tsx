import React from 'react';
import { PlantType } from '../../types/game';
import { PeashooterSVG } from './PeashooterSVG';
import { RepeaterSVG } from './RepeaterSVG';
import { WallnutSVG } from './WallnutSVG';
import { CherryBombSVG } from './CherryBombSVG';
import { SnowPeaSVG } from './SnowPeaSVG';
import { SunflowerSVG } from './SunflowerSVG';

interface PlantRendererProps {
  type: PlantType;
  hp?: number;
  maxHp?: number;
  isShooting?: boolean;
  isGlowing?: boolean;
  fuseProgress?: number;
  className?: string;
}

export const PlantRenderer: React.FC<PlantRendererProps> = ({
  type,
  hp,
  maxHp,
  isShooting,
  isGlowing,
  fuseProgress,
  className = ''
}) => {
  switch (type) {
    case 'sunflower':
      return <SunflowerSVG isGlowing={isGlowing} className={className} />;
    case 'peashooter':
      return <PeashooterSVG isShooting={isShooting} className={className} />;
    case 'repeater':
      return <RepeaterSVG isShooting={isShooting} className={className} />;
    case 'wallnut':
      return <WallnutSVG hp={hp} maxHp={maxHp} className={className} />;
    case 'cherrybomb':
      return <CherryBombSVG fuseProgress={fuseProgress} className={className} />;
    case 'snowpea':
      return <SnowPeaSVG isShooting={isShooting} className={className} />;
    default:
      return null;
  }
};
