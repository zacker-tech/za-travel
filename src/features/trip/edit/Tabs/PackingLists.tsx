import PackingListsForm from '../../components/PackingListsForm';
import type { Trip } from '../../types';
import ContentCard from './ContentCard';

interface Props {
  trip: Trip;
  onUpdate: (data: Partial<Trip>) => void;
}

export default function PackingLists({ trip, onUpdate }: Props) {
  const onChange = (packingLists: Trip['packingLists']) => {
    console.log('change');
    onUpdate({ packingLists });
  };

  return (
    <ContentCard title="Packing list">
      <PackingListsForm
        defaultPackingLists={trip.packingLists}
        onChange={onChange}
      />
    </ContentCard>
  );
}
