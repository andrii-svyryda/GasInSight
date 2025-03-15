"""update enum type

Revision ID: 4e73abd3d617
Revises: c3dec047ec83
Create Date: 2025-03-15 17:28:37.378479

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = '4e73abd3d617'
down_revision: Union[str, None] = 'c3dec047ec83'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.execute("ALTER TYPE sensortype RENAME TO sensortype_old")
    op.execute("CREATE TYPE sensortype AS ENUM('Temperature', 'Humidity', 'Pressure', 'Flow', 'Volume', 'GasComposition', 'LiquidComposition', 'Vibration', 'Noise', 'Corrosion', 'GasDetection', 'FlameDetection', 'LevelIndicator', 'ValveStatus', 'PumpStatus', 'CompressorStatus', 'PowerConsumption', 'WaterContent', 'OxygenContent', 'HydrogenSulfideContent', 'CarbonDioxideContent', 'ParticulateMatter', 'LeakDetection')")
    op.execute("ALTER TABLE sensors ALTER COLUMN type TYPE sensortype USING type::text::sensortype")
    op.execute("DROP TYPE sensortype_old")


def downgrade() -> None:
    """Downgrade schema."""
    op.execute("ALTER TYPE sensortype RENAME TO sensortype_new")
    op.execute("CREATE TYPE sensortype AS ENUM('Temperature', 'Pressure', 'Flow', 'Level', 'Humidity', 'Gas', 'Smoke', 'Fire', 'Motion', 'Proximity', 'Light', 'Sound', 'Vibration', 'Acceleration', 'Gyroscope', 'Magnetometer', 'Other')")
    op.execute("ALTER TABLE sensors ALTER COLUMN type TYPE sensortype USING type::text::sensortype")
    op.execute("DROP TYPE sensortype_new")
