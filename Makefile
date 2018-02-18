.PHONY: build publish \
		set-executable deps \
		clean deep-clean

build: set-executable
	bin/build.sh

publish: set-executable
	bin/publish.sh

set-executable:
	chmod -c +x bin/*.sh

deps:
	yarn install

clean:
	rm -rf target
	rm -rf .nyc_output
	rm -f yarn*.log
	rm -f test-results.xml

deep-clean: clean
	rm -rf node_modules
