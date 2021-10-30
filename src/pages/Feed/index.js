import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, View, Text} from 'react-native';
import LazyImage from '../../components/LazyImage';
import * as S from './styles';

const baseURL = 'http://localhost:3000';
const Feed = () => {
  const [feed, setFeed] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [viewable, setViewable] = useState([]);

  const loadPage = async (pageNumber = page, shouldRefresh = false) => {
    if (total && pageNumber > total) return;

    setLoading(true);

    const response = await fetch(
      `${baseURL}/feed?_expand=author&_limit=5&_page=${pageNumber}`,
    );
    const data = await response.json();
    const totalItems = response.headers.get('X-Total-Count');

    setTotal(Math.floor(totalItems / 5));
    setFeed(shouldRefresh ? data : [...feed, ...data]);
    setPage(pageNumber + 1);
    setLoading(false);
  };

  const refreshList = async () => {
    setRefreshing(true);

    await loadPage(1, true);

    setRefreshing(false);
  };

  useEffect(() => {
    loadPage();
  }, []);

  const handleViewableChanged = useCallback(({changed}) => {
    setViewable(changed.map(({item}) => item.id));
  }, []);

  return (
    <View>
      <FlatList
        data={feed}
        keyExtractor={item => String(item.id)}
        onEndReached={() => loadPage()}
        ListFooterComponent={loading && <S.Loading />}
        onEndReachedThreshold={0.1}
        onRefresh={refreshList}
        onViewableItemsChanged={handleViewableChanged}
        viewabilityConfig={{
          viewAreaCoveragePercentThreshold: 10,
        }}
        refreshing={refreshing}
        renderItem={({item}) => (
          <S.Post>
            <S.Header>
              <S.Avatar source={{uri: item.author.avatar}} />
              <S.Name>{item.author.name}</S.Name>
            </S.Header>
            <LazyImage
              aspectRatio={item.aspectRatio}
              source={{uri: item.image}}
              smallSource={{uri: item.small}}
              shouldLoad={viewable.includes(item.id)}
            />
            <S.Description>
              <S.Name>{item.author.name}</S.Name> {item.description}
            </S.Description>
          </S.Post>
        )}
      />
    </View>
  );
};

export default Feed;
