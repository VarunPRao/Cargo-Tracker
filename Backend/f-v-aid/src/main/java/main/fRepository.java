package main;

import org.springframework.data.repository.CrudRepository;

public interface fRepository extends CrudRepository<Data, Integer>{

	public Data findByIataCode(String code);

}
