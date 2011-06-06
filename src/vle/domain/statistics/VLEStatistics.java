package vle.domain.statistics;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import vle.domain.PersistableDomain;

@Entity
@Table(name="vle_statistics")
public class VLEStatistics extends PersistableDomain {

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id = null;
	
	@Column(name="timestamp")
	private Timestamp timestamp;
	
	@Column(name="data", columnDefinition="TEXT")
	private String data;
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Timestamp getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(Timestamp timestamp) {
		this.timestamp = timestamp;
	}

	public String getData() {
		return data;
	}

	public void setData(String data) {
		this.data = data;
	}

	@Override
	protected Class<?> getObjectClass() {
		return null;
	}
}
