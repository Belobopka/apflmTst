import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TUser } from '../app/API';
import { useAppDispatch, useAppSelector, useUsersListData } from '../app/hooks';
import { deleteUser, fetchUsersAsync } from '../app/store';
import { DEFAULT_USERS_LIMIT } from '../constants';
import { COMMON_STYLES } from '../styles';
import FindInput from './FindInput';
import { Loader } from './Loader/Loader';
import Pagination from './Pagination';
import { UserItem } from './UserItem';

function UsersList() {
  const [filter, setFilter] = React.useState('');
  const dispatch = useAppDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [isSortActive, setIsSortActive] = useState(false);
  const cursor = (currentPage - 1) * DEFAULT_USERS_LIMIT;

  const dataProps = useMemo(() => ({ cursor, isSortActive, filter }), [cursor, filter, isSortActive]);
  const { users, usersLength } = useUsersListData(dataProps);
  const status = useAppSelector(state => state.users.status);

  useEffect(() => {
    dispatch(fetchUsersAsync());
  }, [dispatch]);

  const handleChangePage = useCallback((page: number) => setCurrentPage(page), []);

  const handleRemoveUser = useCallback(
    (id: number) => {
      dispatch(deleteUser(id));
    },
    [dispatch],
  );

  const handleFindChange = useCallback((text: string) => {
    setFilter(text);
  }, []);

  const renderItem = useCallback(
    (item: TUser) => (
      <View key={item.id} style={styles.itemWrapper}>
        <UserItem onRemove={handleRemoveUser} item={item} />
      </View>
    ),
    [handleRemoveUser],
  );

  const handleChangeSortState = useCallback(() => {
    setIsSortActive(!isSortActive);
  }, [isSortActive]);

  return (
    <View style={styles.root}>
      <View style={styles.headerContainer}>
        <FindInput value={filter} onChangeText={handleFindChange} />
        <TouchableOpacity onPress={handleChangeSortState}>
          <Text>Sort By BirthDay {isSortActive ? '👌 On' : '❌ Off'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.root}>
        {status === 'loading' ? (
          <Loader />
        ) : (
          // key is used as lazy implementation of scroll to top
          <ScrollView key={cursor} style={styles.scroll} contentContainerStyle={styles.scrollContainer}>
            {users.map(renderItem)}
          </ScrollView>
        )}
      </View>
      <View style={styles.paginationContainer}>
        <Pagination itemsLength={usersLength} onPressPage={handleChangePage} currentPage={currentPage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  paginationContainer: {
    minHeight: 50,
  },
  headerContainer: {
    ...COMMON_STYLES.mt_1,
    ...COMMON_STYLES.mh_2,
    ...COMMON_STYLES.pb_1,
  },
  scroll: {
    ...COMMON_STYLES.mh_1,
  },
  scrollContainer: {
    flexGrow: 1,
    ...COMMON_STYLES.pb_1,
  },
  itemWrapper: {
    ...COMMON_STYLES.mt_2,
  },
});

export default UsersList;
