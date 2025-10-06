'use client';

import React, { useState } from 'react';
import Table2 from '../genA/v2/table2';
import useResource from '@/hooks/useResource';
import { viewTypeIds } from '@/components/genA/v2/viewTypeIds';

const SeatsTable = ({ 
  seats = [], 
  setSeats, 
  onSeatsChange,
  ...props 
}) => {
  const seatTypesResource = useResource('seatTypes');
  const seatPurposesResource = useResource('seatPurposes');
  const [seatTypes, setSeatTypes] = useState([]);
  const [seatPurposes, setSeatPurposes] = useState([]);
  const [query, setQuery] = useState({
    paging: { skip: 0, take: 1000 },
    filter: {},
    sort: { number: { operator: 'asc' } }
  });

  // Load seat types and seat purposes for dropdowns
  React.useEffect(() => {
    const loadSeatTypes = async () => {
      try {
        const response = await seatTypesResource.search({ paging: { skip: 0, take: 1000 } });
        setSeatTypes(response?.result || []);
      } catch (e) {
        console.error('Error loading seat types:', e);
      }
    };
    
    const loadSeatPurposes = async () => {
      try {
        const response = await seatPurposesResource.search({ paging: { skip: 0, take: 1000 } });
        setSeatPurposes(response?.result || []);
      } catch (e) {
        console.error('Error loading seat purposes:', e);
      }
    };
    
    loadSeatTypes();
    loadSeatPurposes();
  }, []);

  const columns = [
    {
      key: 'number',
      title: 'Место',
      isSortable: true,
      editable: true,
      type: viewTypeIds.text
    },
    // {
    //   key: 'class',
    //   title: 'Класс',
    //   isSortable: true,
    //   editable: true,
    //   type: viewTypeIds.number
    // },
    {
      key: 'type',
      title: 'Тип места',
      isSortable: true,
      editable: true,
      isEdit: true,
      style: { width: '300px' },
      type: viewTypeIds.select,
      options: {
        items: seatTypes,
        relationMemberName: 'typeId',
        props: { mode: 'portal', labelMemberName: 'name', valueMemberName: 'id' }
      },
      render: (value) => {
        const seatType = seatTypes.find(st => st.id === value);
        return seatType?.name || '';
      }
    },
    {
      key: 'purpose',
      title: 'Назначение',
      isSortable: true,
      editable: true,
      isEdit: true,
      style: { width: '300px' },
      type: viewTypeIds.select,
      options: {
        items: seatPurposes,
        relationMemberName: 'purposeId',
        props: { mode: 'portal', labelMemberName: 'name', valueMemberName: 'id' }
      },
      render: (value) => {
        const seatPurpose = seatPurposes.find(sp => sp.id === value);
        return seatPurpose?.name || '';
      }
    }
  ];

  const handleSeatsChange = (updatedSeats) => {
    setSeats(updatedSeats);
    if (onSeatsChange) {
      onSeatsChange(updatedSeats);
    }
  };

  return (
      <Table2
        keyMember="number"
        data={seats}
        setData={handleSeatsChange}
        query={query}
        setQuery={setQuery}
        columns={columns}
        filters={[
          { title: 'Номер', key: 'number' },
          { title: 'Класс', key: 'class' },
          { title: 'Тип места', key: 'typeId' },
          { title: 'Назначение', key: 'purposeId' }
        ]}
        sorts={[
          { key: 'number', title: 'Номер' },
          { key: 'class', title: 'Класс' },
          { key: 'typeId', title: 'Тип места' },
          { key: 'purposeId', title: 'Назначение' }
        ]}
        isTopPanel={false}
        isPager={false}
        isActions={false}
        {...props}
      />
  );
};

export default SeatsTable;

