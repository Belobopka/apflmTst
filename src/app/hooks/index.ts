import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { DEFAULT_USERS_LIMIT } from '../../constants';
import { TUsers } from '../API';
import { AppDispatch, getUsers, RootState } from '../store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useViewportUnits = () => {
  const { width, height } = useWindowDimensions();

  const vh = height / 100;
  const vw = width / 100;

  return { vh, vw };
};

function sliceItems(items: TUsers, cursor: number, limit: number) {
  return items.slice(cursor, cursor + limit);
}

export function useUsersListData(props: { isSortActive?: boolean; filter?: string; cursor: number }) {
  const { isSortActive, filter, cursor = 0 } = props;
  const unfilteredUsers = useAppSelector(getUsers);

  const filteredUsers = useMemo(() => {
    if (!filter) {
      return unfilteredUsers;
    }
    return unfilteredUsers.filter(({ name }) => name.toString().toLowerCase().indexOf(filter.toLowerCase()) !== -1, []);
  }, [filter, unfilteredUsers]);

  const orederedUsersByDate = useMemo(() => {
    if (!isSortActive) {
      return filteredUsers;
    }
    return [...filteredUsers].sort((itemA, itemB) => itemA.age - itemB.age);
  }, [filteredUsers, isSortActive]);
  const usersLength = orederedUsersByDate.length;
  const slicedUsers = sliceItems(orederedUsersByDate, cursor, DEFAULT_USERS_LIMIT);
  const users = slicedUsers;
  const ctx = useMemo(() => ({ users, usersLength }), [users, usersLength]);
  return ctx;
}
