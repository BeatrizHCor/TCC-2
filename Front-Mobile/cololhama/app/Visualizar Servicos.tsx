import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';

type Servico = {
  id: string;
  nome: string;
  descricao: string;
  precoMin?: number;
  precoMax?: number;
};

export default function VisualizarServicosScreen() {
  const { salaoId } = useLocalSearchParams() as { salaoId: string };
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [nomeFilter, setNomeFilter] = useState('');
  const [precoMinFilter, setPrecoMinFilter] = useState<number | ''>('');
  const [precoMaxFilter, setPrecoMaxFilter] = useState<number | ''>('');

  const [servicos, setServicos] = useState<Servico[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const mockServicos: Servico[] = Array.from({ length: 50 }, (_, i) => ({
    id: `${i + 1}`,
    nome: `Serviço ${i + 1}`,
    descricao: `Descrição do serviço ${i + 1}`,
    precoMin: 50 + i * 5,
    precoMax: 100 + i * 5,
  }));

  useEffect(() => {
    setIsLoading(true);

    const timeout = setTimeout(() => {
      const filtered = mockServicos.filter((servico) => {
        const matchNome = servico.nome.toLowerCase().includes(nomeFilter.toLowerCase());
        const matchMin = precoMinFilter === '' || servico.precoMin! >= precoMinFilter;
        const matchMax = precoMaxFilter === '' || servico.precoMax! <= precoMaxFilter;
        return matchNome && matchMin && matchMax;
      });

      const start = (page - 1) * limit;
      const paginated = filtered.slice(start, start + limit);
      setHasMore(start + limit < filtered.length);

      if (page === 1) {
        setServicos(paginated);
      } else {
        setServicos((prev) => [...prev, ...paginated]);
      }

      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [page, nomeFilter, precoMinFilter, precoMaxFilter]);

  const handleEditarServico = (id: string) => {
    console.log('Editar serviço:', id);
    // router.push(`/servicos/editar/${id}`);
  };

  const handleFiltroChange = (
    nome: string,
    precoMin: number | '',
    precoMax: number | ''
  ) => {
    setPage(1);
    setHasMore(true);
    setNomeFilter(nome);
    setPrecoMinFilter(precoMin);
    setPrecoMaxFilter(precoMax);
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#c62828', marginBottom: 16 }}>
        Serviços do Salão {salaoId}
      </Text>

      <TextInput
        placeholder="Buscar por nome"
        value={nomeFilter}
        onChangeText={(text) => handleFiltroChange(text, precoMinFilter, precoMaxFilter)}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 8,
          borderRadius: 8,
          marginBottom: 8,
        }}
      />

      <View style={{ flexDirection: 'row', gap: 8 }}>
        <TextInput
          placeholder="Preço mínimo"
          value={precoMinFilter?.toString()}
          onChangeText={(text) =>
            handleFiltroChange(nomeFilter, text === '' ? '' : Number(text), precoMaxFilter)
          }
          keyboardType="numeric"
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 8,
            borderRadius: 8,
          }}
        />
        <TextInput
          placeholder="Preço máximo"
          value={precoMaxFilter?.toString()}
          onChangeText={(text) =>
            handleFiltroChange(nomeFilter, precoMinFilter, text === '' ? '' : Number(text))
          }
          keyboardType="numeric"
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 8,
            borderRadius: 8,
          }}
        />
      </View>

      {isLoading && page === 1 ? (
        <ActivityIndicator size="large" color="#c62828" style={{ marginTop: 32 }} />
      ) : (
        <FlatList
          data={servicos}
          keyExtractor={(item) => item.id}
          style={{ marginTop: 16 }}
          renderItem={({ item }) => (
            <View
              style={{
                padding: 12,
                marginBottom: 10,
                borderWidth: 1.5,
                borderColor: '#ef5350',
                borderRadius: 8,
                backgroundColor: '#fff8f8',
              }}
            >
              <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#b71c1c' }}>{item.nome}</Text>
              <Text style={{ marginBottom: 4 }}>{item.descricao}</Text>
              <Text>Preço Mín: R$ {item.precoMin?.toFixed(2) ?? 'N/A'}</Text>
              <Text>Preço Máx: R$ {item.precoMax?.toFixed(2) ?? 'N/A'}</Text>

              <TouchableOpacity
                onPress={() => handleEditarServico(item.id)}
                style={{
                  marginTop: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                  paddingVertical: 6,
                }}
              >
                <Ionicons name="create-outline" size={18} color="#d32f2f" />
                <Text style={{ color: '#d32f2f' }}>Editar</Text>
              </TouchableOpacity>
            </View>
          )}
          onEndReached={() => {
            if (hasMore && !isLoading) setPage((prev) => prev + 1);
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoading && page > 1 ? <ActivityIndicator color="#c62828" style={{ margin: 16 }} /> : null
          }
        />
      )}
    </View>
  );
}
